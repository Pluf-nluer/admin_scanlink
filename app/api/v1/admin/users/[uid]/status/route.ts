import { NextRequest, NextResponse } from 'next/server';
import { MockDatabase } from '../../../../../../../adapters/repositories/mockDatabase';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ uid: string }> | { uid: string } }
) {
  try {
    const resolvedParams = await params;
    const uid = resolvedParams.uid;
    const body = await request.json();
    const { isActive } = body;
    
    if (typeof isActive !== 'boolean') {
      return NextResponse.json({ status: 'error', message: 'isActive must be a boolean' }, { status: 400 });
    }
    
    const updatedUser = MockDatabase.updateUserStatus(uid, isActive);
    if (!updatedUser) {
      return NextResponse.json({ status: 'error', message: 'User not found' }, { status: 404 });
    }
    
    return NextResponse.json({
      status: 'success',
      message: 'Trạng thái người dùng đã được cập nhật thành công',
      data: {
        uid: updatedUser.uid,
        isActive: updatedUser.isActive,
        updatedAt: updatedUser.updatedAt
      }
    });
  } catch (error: any) {
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
