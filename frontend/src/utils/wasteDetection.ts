import { wasteCategories } from './wasteCategories';

// -------------------------------------------------------
// REAL MODEL DETECTION
// -------------------------------------------------------
export async function detectWasteType(imageData: string): Promise<{
  wasteType: string;
  confidence: number;
  itemName: string;
}> {
  try {
    const blob = await fetch(imageData).then(r => r.blob());

    const formData = new FormData();
    formData.append('file', blob, 'upload.jpg'); // match backend field name

    const response = await fetch('https://sahibin-ai.onrender.com/api/detect', {
      method: 'POST',
      body: formData
    });

    const raw = await response.text();
    console.log('API RAW RESPONSE:', raw);

    if (!response.ok) {
      throw new Error('Model API request failed: ' + raw);
    }

    let result;
    try {
      result = JSON.parse(raw);
    } catch {
      throw new Error('Invalid JSON from backend: ' + raw);
    }

    // Your app requires:
    // {
    //   wasteType: string;
    //   confidence: number;
    //   itemName: string;
    // }

    // But we don’t know backend keys yet, so we map safely:
    const predictedClass =
      result.waste_type ||   // <- check this first
      result.predicted_class ||
      result.class ||
      result.label ||
      result.type ||
      'plastic';

    const confidence =
      result.confidence ||
      result.score ||
      result.probability ||
      0;

    const itemName =
      result.item_name ||
      result.label ||
      predictedClass;

    return {
      wasteType: mapToWasteCategory(predictedClass),
      confidence: Math.round(confidence),
      itemName: formatItemName(itemName)
    };
  } catch (err) {
    console.error('DETECTION ERROR:', err);
    throw new Error('Failed to detect waste type');
  }
}

// -------------------------------------------------------
// CATEGORY MAPPING
// -------------------------------------------------------
function mapToWasteCategory(modelClass: string): string {
  const mapping: Record<string, string> = {
    cardboard: 'CARDBOARD',
    glass: 'GLASS',
    metal: 'METAL',
    paper: 'PAPER',
    plastic: 'PLASTIC',
    battery: 'BATTERY',
    clothes: 'CLOTHES',
    organic: 'ORGANIC',
    shoes: 'SHOES'
  };
  return mapping[modelClass?.toLowerCase()] || 'PLASTIC';
}

function formatItemName(name: string): string {
  return name.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

// -------------------------------------------------------
// REQUIRED BY YOUR APP (CRITICAL!)
// -------------------------------------------------------
export function getCompleteDetectionResult(
  wasteType: string,
  confidence: number,
  itemName: string,
  imageUrl: string
) {
  const categoryData = wasteCategories[wasteType];

  if (!categoryData) {
    throw new Error(`Unknown waste type: ${wasteType}`);
  }

  return {
    itemName,
    confidence,
    isRecyclable: categoryData.isRecyclable,
    wasteType,
    category: categoryData.name,
    image: imageUrl,
    co2Impact: categoryData.co2Impact,
    energyImpact: categoryData.energyImpact,
    waterImpact: categoryData.waterImpact,
    disposalInstructions: categoryData.disposalInstructions,
    disposalBin: categoryData.disposalBin,
    environmentalTip: categoryData.environmentalTip,
    warnings: categoryData.warnings,
    preparationTime: categoryData.preparationTime,
    collectionSchedule: categoryData.collectionSchedule
  };
}
