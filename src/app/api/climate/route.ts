import { NextResponse } from 'next/server';

interface CO2Entry {
  year: string;
  month: string;
  day: string;
  cycle: string;
  trend: string;
}

interface TempEntry {
  time: string;
  station: string;
  land: string;
}

export async function GET() {
  try {
    const [co2Res, tempRes] = await Promise.all([
      fetch('https://global-warming.org/api/co2-api', { next: { revalidate: 86400 } }),
      fetch('https://global-warming.org/api/temperature-api', { next: { revalidate: 86400 } }),
    ]);

    const co2Data = await co2Res.json();
    const tempData = await tempRes.json();

    const co2List: CO2Entry[] = co2Data.co2;
    const latestCO2 = co2List[co2List.length - 1];
    const co2Value = parseFloat(latestCO2.trend);

    const tempReadings: TempEntry[] = Object.values(tempData.result);
    const latestTemp = tempReadings[tempReadings.length - 1];
    const tenYearsAgoTemp = tempReadings[Math.max(0, tempReadings.length - 120)];
    const anomaly = parseFloat(latestTemp.land);
    const trend10y = (anomaly - parseFloat(tenYearsAgoTemp.land)).toFixed(2);

    return NextResponse.json({
      co2: {
        value: co2Value.toFixed(1),
        year: latestCO2.year,
        month: latestCO2.month,
        abovePreIndustrial: (((co2Value - 280) / 280) * 100).toFixed(0),
      },
      temperature: {
        anomaly: anomaly.toFixed(2),
        year: Math.floor(parseFloat(latestTemp.time)).toString(),
        trend10y,
      },
    });
  } catch {
    return NextResponse.json({ error: 'No se pudo obtener datos climáticos' }, { status: 500 });
  }
}
