from fastapi import FastAPI, File, UploadFile, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
from PIL import Image
import io
import os
from datetime import datetime
from geopy.geocoders import Nominatim
from geopy.distance import geodesic
import googlemaps
import google.generativeai as genai
from dotenv import load_dotenv
import json

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize YOLO (Fix for PyTorch safe loading)
try:
    import torch
    # import the DetectionModel class used by ultralytics checkpoints
    from ultralytics.nn.tasks import DetectionModel

    # add DetectionModel to torch's safe globals so torch.load(..., weights_only=True) can accept it
    try:
        torch.serialization.add_safe_globals([DetectionModel])
    except Exception:
        # In some torch versions the API may differ; ignore if unable to add
        pass
except Exception as e:
    # If torch or DetectionModel import fails, print a warning and continue.
    # We still attempt to initialize YOLO below; if ultralytics uses torch under the hood
    # it may surface a clearer error then.
    print(f"⚠️ Torch/DetectionModel import warning: {e}")

# Initialize YOLO model with debug logging
try:
    print("=" * 50)
    print("🔍 DEBUG: Starting model loading process")
    print(f"📂 Current working directory: {os.getcwd()}")
    print(f"📂 Files in current directory: {os.listdir('.')}")
    print("=" * 50)
    
    # Check if models folder exists
    if os.path.exists('models'):
        print("✅ 'models' folder exists")
        print(f"📂 Files in models/: {os.listdir('models')}")
    else:
        print("❌ 'models' folder does NOT exist")
    
    # Check if best.pt exists
    if os.path.exists('models/best.pt'):
        print("✅ Found models/best.pt")
        file_size = os.path.getsize('models/best.pt')
        print(f"📏 File size: {file_size / (1024*1024):.2f} MB")
        
        print("🔄 Attempting to load YOLO model...")
        model = YOLO('models/best.pt')
        print("✅ YOLO model loaded successfully")
    else:
        print("❌ models/best.pt NOT FOUND")
        # Try alternate path
        if os.path.exists('best.pt'):
            print("✅ Found best.pt in root")
            model = YOLO('best.pt')
            print("✅ YOLO model loaded from root")
        else:
            print("❌ best.pt not found anywhere")
            model = None
        
except Exception as e:
    print("=" * 50)
    print(f"❌ EXCEPTION while loading YOLO model:")
    print(f"Error type: {type(e).__name__}")
    print(f"Error message: {e}")
    print("=" * 50)
    
    # Print full traceback
    import traceback
    traceback.print_exc()
    
    model = None

try:
    geolocator = Nominatim(user_agent="sahibin_waste_detector")
    print("✅ Geolocator initialized")
except Exception as e:
    print(f"❌ Geolocator error: {e}")
    geolocator = None

try:
    gmaps_key = os.getenv('GOOGLE_MAPS_API_KEY')
    if gmaps_key:
        gmaps = googlemaps.Client(key=gmaps_key)
        print("✅ Google Maps initialized")
    else:
        print("⚠️ Google Maps API key not found")
        gmaps = None
except Exception as e:
    print(f"❌ Google Maps error: {e}")
    gmaps = None

try:
    gemini_key = os.getenv('GEMINI_API_KEY')
    if gemini_key:
        genai.configure(api_key=gemini_key)
        gemini_model = genai.GenerativeModel('gemini-pro')
        print("✅ Gemini AI initialized")
    else:
        print("⚠️ Gemini API key not found")
        gemini_model = None
except Exception as e:
    print(f"❌ Gemini AI error: {e}")
    gemini_model = None

# Waste information
WASTE_INFO = {
    'CARDBOARD': {
        'recyclable': True,
        'disposal_bin': 'Recycling Bin (Blue)',
        'color': '#D97706',
        'icon': '📦',
        'category': 'Paper Products',
        'instructions': [
            'Flatten all cardboard boxes',
            'Remove tape and labels',
            'Keep dry and clean',
            'Place in recycling bin'
        ],
        'environmental_tip': 'Recycling cardboard saves 24% of energy',
        'co2_saved': 0.4,
        'energy_saved': 1.2,
        'water_saved': 8,
        'trees_equivalent': 0.017
    },
    'GLASS': {
        'recyclable': True,
        'disposal_bin': 'Recycling Bin (Blue)',
        'color': '#06B6D4',
        'icon': '🥃',
        'category': 'Glass Materials',
        'instructions': [
            'Rinse thoroughly',
            'Remove caps and lids',
            'No need to remove labels',
            'Place in glass recycling'
        ],
        'environmental_tip': 'Glass can be recycled infinitely without loss of quality',
        'co2_saved': 0.3,
        'energy_saved': 0.8,
        'water_saved': 5,
        'trees_equivalent': 0.012
    },
    'METAL': {
        'recyclable': True,
        'disposal_bin': 'Recycling Bin (Blue)',
        'color': '#64748B',
        'icon': '⚙️',
        'category': 'Metal Products',
        'instructions': [
            'Rinse and clean',
            'Crush cans to save space',
            'Remove paper labels',
            'Place in metal recycling'
        ],
        'environmental_tip': 'Recycling aluminum saves 95% of energy',
        'co2_saved': 1.2,
        'energy_saved': 3.5,
        'water_saved': 15,
        'trees_equivalent': 0.045
    },
    'PAPER': {
        'recyclable': True,
        'disposal_bin': 'Recycling Bin (Blue)',
        'color': '#3B82F6',
        'icon': '📄',
        'category': 'Paper Products',
        'instructions': [
            'Keep dry and clean',
            'Remove plastic coating',
            'Flatten paper items',
            'Place in paper recycling'
        ],
        'environmental_tip': 'Recycling one ton of paper saves 17 trees',
        'co2_saved': 0.6,
        'energy_saved': 1.5,
        'water_saved': 25,
        'trees_equivalent': 0.024
    },
    'PLASTIC': {
        'recyclable': True,
        'disposal_bin': 'Recycling Bin (Blue)',
        'color': '#8B5CF6',
        'icon': '♻️',
        'category': 'Plastic Products',
        'instructions': [
            'Check recycling number (1-7)',
            'Rinse thoroughly',
            'Remove caps',
            'Place in plastic recycling'
        ],
        'environmental_tip': 'Plastic takes 450+ years to decompose in landfills',
        'co2_saved': 0.5,
        'energy_saved': 1.8,
        'water_saved': 12,
        'trees_equivalent': 0.019
    },
    'BATTERY': {
        'recyclable': True,
        'disposal_bin': 'Special Waste Collection',
        'color': '#EAB308',
        'icon': '🔋',
        'category': 'Hazardous Waste',
        'instructions': [
            'Never throw in regular trash',
            'Take to battery collection point',
            'Tape terminals for safety',
            'Store in cool, dry place'
        ],
        'environmental_tip': 'Batteries contain toxic materials that contaminate soil',
        'co2_saved': 0.2,
        'energy_saved': 0.5,
        'water_saved': 3,
        'trees_equivalent': 0.008,
        'warnings': ['⚠️ HAZARDOUS WASTE - Never put in regular bins!']
    },
    'CLOTHES': {
        'recyclable': True,
        'disposal_bin': 'Textile Recycling / Donation',
        'color': '#EC4899',
        'icon': '👕',
        'category': 'Textiles',
        'instructions': [
            'Clean and dry clothes',
            'Donate if in good condition',
            'Textile recycling for damaged items',
            'Never throw in regular trash'
        ],
        'environmental_tip': 'Textile recycling reduces landfill waste',
        'co2_saved': 0.8,
        'energy_saved': 2.2,
        'water_saved': 30,
        'trees_equivalent': 0.032
    },
    'ORGANIC': {
        'recyclable': False,
        'disposal_bin': 'Compost Bin (Green)',
        'color': '#22C55E',
        'icon': '🌱',
        'category': 'Organic Waste',
        'instructions': [
            'Separate from packaging',
            'Chop large pieces',
            'Place in compost bin',
            'Cover with brown materials'
        ],
        'environmental_tip': 'Composting reduces methane emissions from landfills',
        'co2_saved': 0.3,
        'energy_saved': 0.4,
        'water_saved': 2,
        'trees_equivalent': 0.011,
        'warnings': ['⚠️ Avoid meat, dairy in home compost']
    },
    'SHOES': {
        'recyclable': True,
        'disposal_bin': 'Textile Recycling / Donation',
        'color': '#7C3AED',
        'icon': '👟',
        'category': 'Footwear',
        'instructions': [
            'Clean shoes',
            'Tie pairs together',
            'Donate if wearable',
            'Shoe recycling for damaged'
        ],
        'environmental_tip': 'Many brands have take-back recycling programs',
        'co2_saved': 0.7,
        'energy_saved': 1.9,
        'water_saved': 20,
        'trees_equivalent': 0.028
    }
}

# Stats storage
STATS_FILE = 'data/user_stats.json'

def load_stats():
    try:
        with open(STATS_FILE, 'r') as f:
            return json.load(f)
    except:
        return {
            'total_scans': 0,
            'recyclable_count': 0,
            'non_recyclable_count': 0,
            'total_co2_saved': 0,
            'total_energy_saved': 0,
            'total_water_saved': 0,
            'total_trees_saved': 0,
            'category_counts': {},
            'scan_history': []
        }

def save_stats(stats):
    os.makedirs('data', exist_ok=True)
    with open(STATS_FILE, 'w') as f:
        json.dump(stats, f, indent=2)

@app.get("/")
async def root():
    return {
        "message": "🎉 SahiBin API v2.0 is running!",
        "status": "healthy",
        "model_loaded": model is not None,
        "google_maps": gmaps is not None,
        "gemini_ai": gemini_model is not None,
        "endpoints": [
            "POST /api/detect - Upload image for detection",
            "GET /api/stats - Get statistics",
            "GET /api/collection-centers - Find nearby centers"
        ]
    }

@app.post("/api/detect")
async def detect_waste(file: UploadFile = File(...)):
    if model is None:
        raise HTTPException(status_code=500, detail="YOLO model not loaded. Check models/best.pt exists")
    
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        
        results = model(image)[0]
        
        if len(results.boxes) == 0:
            return {
                "success": False,
                "message": "No waste detected. Please try again with a clearer image."
            }
        
        top_box = results.boxes[0]
        class_id = int(top_box.cls[0])
        confidence = float(top_box.conf[0])
        class_name = results.names[class_id]
        
        info = WASTE_INFO.get(class_name, {})
        
        if not info:
            return {
                "success": False,
                "message": f"Unknown category: {class_name}"
            }
        
        # Update stats
        stats = load_stats()
        stats['total_scans'] += 1
        if info['recyclable']:
            stats['recyclable_count'] += 1
        else:
            stats['non_recyclable_count'] += 1
        stats['total_co2_saved'] += info['co2_saved']
        stats['total_energy_saved'] += info['energy_saved']
        stats['total_water_saved'] += info['water_saved']
        stats['total_trees_saved'] += info.get('trees_equivalent', 0)
        
        if class_name not in stats['category_counts']:
            stats['category_counts'][class_name] = 0
        stats['category_counts'][class_name] += 1
        
        stats['scan_history'].append({
            'waste_type': class_name,
            'confidence': round(confidence * 100, 2),
            'timestamp': datetime.now().isoformat()
        })
        
        save_stats(stats)
        
        return {
            "success": True,
            "waste_type": class_name,
            "confidence": round(confidence * 100, 2),
            "recyclable": info['recyclable'],
            "disposal_bin": info['disposal_bin'],
            "color": info['color'],
            "icon": info['icon'],
            "category": info.get('category', 'Unknown'),
            "instructions": info['instructions'],
            "environmental_tip": info['environmental_tip'],
            "co2_saved": info['co2_saved'],
            "energy_saved": info['energy_saved'],
            "water_saved": info['water_saved'],
            "trees_saved": info.get('trees_equivalent', 0),
            "warnings": info.get('warnings', []),
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Detection error: {str(e)}")

@app.get("/api/stats")
async def get_stats():
    stats = load_stats()
    recycling_rate = 0
    if stats['total_scans'] > 0:
        recycling_rate = round((stats['recyclable_count'] / stats['total_scans']) * 100, 1)
    
    return {
        "success": True,
        "items_detected": stats['total_scans'],
        "recyclable": stats['recyclable_count'],
        "non_recyclable": stats['non_recyclable_count'],
        "recycling_rate": recycling_rate,
        "co2_saved": round(stats['total_co2_saved'], 2),
        "energy_saved": round(stats['total_energy_saved'], 2),
        "water_saved": round(stats['total_water_saved'], 2),
        "trees_saved": round(stats['total_trees_saved'], 3),
        "category_distribution": stats['category_counts'],
        "recent_scans": stats['scan_history'][-10:]
    }

@app.get("/api/collection-centers")
async def find_collection_centers(
    lat: float = Query(...),
    lng: float = Query(...),
    radius: int = Query(5),
    waste_type: str = Query(None)
):
    if gmaps is None:
        raise HTTPException(status_code=503, detail="Google Maps not configured. Add GOOGLE_MAPS_API_KEY to .env")
    
    try:
        user_location = (lat, lng)
        
        search_queries = {
            'CARDBOARD': 'recycling center',
            'GLASS': 'glass recycling',
            'METAL': 'metal recycling',
            'PAPER': 'paper recycling',
            'PLASTIC': 'plastic recycling',
            'BATTERY': 'battery disposal',
            'CLOTHES': 'clothing donation',
            'ORGANIC': 'composting facility',
            'SHOES': 'shoe donation'
        }
        
        query = search_queries.get(waste_type, 'recycling center') if waste_type else 'recycling center'
        
        places_result = gmaps.places_nearby(
            location=user_location,
            radius=radius * 1000,
            keyword=query
        )
        
        centers = []
        for place in places_result.get('results', [])[:10]:
            place_location = (
                place['geometry']['location']['lat'],
                place['geometry']['location']['lng']
            )
            
            distance = geodesic(user_location, place_location).kilometers
            
            center = {
                'id': place['place_id'],
                'name': place.get('name', 'Unknown Center'),
                'address': place.get('vicinity', 'Address not available'),
                'lat': place['geometry']['location']['lat'],
                'lng': place['geometry']['location']['lng'],
                'distance': round(distance, 2),
                'rating': place.get('rating'),
                'google_maps_url': f"https://www.google.com/maps/place/?q=place_id:{place['place_id']}"
            }
            centers.append(center)
        
        centers.sort(key=lambda x: x['distance'])
        
        return {
            "success": True,
            "user_location": {"lat": lat, "lng": lng},
            "search_radius": radius,
            "total_found": len(centers),
            "centers": centers
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    print("\n" + "="*50)
    print("🚀 Starting SahiBin Backend Server")
    print("="*50)
    print(f"✅ Backend URL: http://localhost:8000")
    print(f"📚 API Docs: http://localhost:8000/docs")
    print("="*50 + "\n")
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
