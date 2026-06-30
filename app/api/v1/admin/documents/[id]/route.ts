import { NextRequest, NextResponse } from 'next/server';
import { MockDatabase } from '../../../../../../adapters/repositories/mockDatabase';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;
    
    const isDeleted = MockDatabase.deleteDocument(id);
    if (!isDeleted) {
      return NextResponse.json({ status: 'error', message: 'Không tìm thấy tài liệu theo ID cung cấp.' }, { status: 404 });
    }
    
    return NextResponse.json({
      status: 'success',
      message: 'Quản trị viên đã cưỡng chế xóa tài liệu thành công',
      data: null
    });
  } catch (error: any) {
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
