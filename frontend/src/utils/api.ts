const API_URL = "https://sahibin-ai.onrender.com";

export async function detectWaste(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_URL}/api/detect`, {
        method: "POST",
        body: formData,
    });

    return response.json();
}

export async function getStats() {
    const response = await fetch(`${API_URL}/api/stats`);
    return response.json();
}

export async function getCenters(lat: number, lng: number, wasteType?: string) {
    const params = new URLSearchParams({
        lat: lat.toString(),
        lng: lng.toString(),
        radius: "5"
    });

    if (wasteType) params.append("waste_type", wasteType);

    const response = await fetch(`${API_URL}/api/collection-centers?${params}`);
    return response.json();
}
