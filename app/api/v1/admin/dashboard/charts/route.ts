import { NextRequest, NextResponse } from 'next/server';
import { MockDatabase } from '../../../../../../adapters/repositories/mockDatabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const daysParam = searchParams.get('days');
    const days = daysParam ? parseInt(daysParam, 10) : 30;
    
    const charts = MockDatabase.getCharts(days);
    return NextResponse.json({
      status: 'success',
      message: 'Lấy dữ liệu biểu đồ thành công',
      data: charts
    });
  } catch (error: any) {
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
