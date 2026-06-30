import { NextResponse } from 'next/server';
import { MockDatabase } from '../../../../../../adapters/repositories/mockDatabase';

export async function GET() {
  try {
    const stats = MockDatabase.getStats();
    return NextResponse.json({
      status: 'success',
      message: 'Lấy số liệu thống kê thành công',
      data: stats
    });
  } catch (error: any) {
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
