import { NextRequest, NextResponse } from 'next/server';
import { MockDatabase } from '../../../../../adapters/repositories/mockDatabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '0', 10);
    const size = parseInt(searchParams.get('size') || '20', 10);
    const search = searchParams.get('search') || '';
    const ownerUid = searchParams.get('ownerUid') || '';
    
    const docsResult = MockDatabase.getDocuments(page, size, search, ownerUid);
    return NextResponse.json({
      status: 'success',
      message: 'Lấy danh sách tài liệu thành công',
      data: docsResult
    });
  } catch (error: any) {
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
