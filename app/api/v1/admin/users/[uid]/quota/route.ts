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
    const { storageLimitBytes } = body;
    
    if (typeof storageLimitBytes !== 'number' || storageLimitBytes < 0) {
      return NextResponse.json({ status: 'error', message: 'storageLimitBytes must be a non-negative number' }, { status: 400 });
    }
    
    const updatedUser = MockDatabase.updateUserQuota(uid, storageLimitBytes);
    if (!updatedUser) {
      return NextResponse.json({ status: 'error', message: 'User not found' }, { status: 404 });
    }
    
    return NextResponse.json({
      status: 'success',
      message: 'Hạn mức bộ nhớ đã được cập nhật thành công',
      data: {
        uid: updatedUser.uid,
        storageLimit: updatedUser.storageLimit,
        updatedAt: updatedUser.updatedAt
      }
    });
  } catch (error: any) {
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
