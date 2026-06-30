import { User } from '../../core/entities/user';
import { Document } from '../../core/entities/document';

// Initialize default mock users
const initialUsers: User[] = [
  {
    uid: 'fb_uid_admin',
    email: 'admin@scanlink.vn',
    displayName: 'ScanLink Administrator',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    role: 'ADMIN',
    isActive: true,
    providerId: 'password',
    storageUsed: 0, // Will be computed from documents
    storageLimit: 536870912000, // 500 GB
    createdAt: '2026-01-01T08:00:00Z',
    updatedAt: '2026-06-30T12:00:00Z'
  },
  {
    uid: 'fb_uid_1',
    email: 'nguyenvana@gmail.com',
    displayName: 'Nguyen Van A',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    role: 'USER',
    isActive: true,
    providerId: 'google.com',
    storageUsed: 0,
    storageLimit: 104857600, // 100 MB
    createdAt: '2026-06-10T14:32:00Z',
    updatedAt: '2026-06-28T09:15:00Z'
  },
  {
    uid: 'fb_uid_2',
    email: 'tranthib@gmail.com',
    displayName: 'Tran Thi B',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    role: 'USER',
    isActive: true,
    providerId: 'google.com',
    storageUsed: 0,
    storageLimit: 104857600, // 100 MB
    createdAt: '2026-06-12T10:15:00Z',
    updatedAt: '2026-06-29T16:40:00Z'
  },
  {
    uid: 'fb_uid_3',
    email: 'levanc@outlook.com',
    displayName: 'Le Van C',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    role: 'USER',
    isActive: false, // Inactive user
    providerId: 'password',
    storageUsed: 0,
    storageLimit: 104857600, // 100 MB
    createdAt: '2026-06-05T09:00:00Z',
    updatedAt: '2026-06-06T11:22:00Z'
  },
  {
    uid: 'fb_uid_4',
    email: 'phamminhd@gmail.com',
    displayName: 'Pham Minh D',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    role: 'USER',
    isActive: true,
    providerId: 'google.com',
    storageUsed: 0,
    storageLimit: 10737418240, // 10 GB (Premium user)
    createdAt: '2026-05-20T11:00:00Z',
    updatedAt: '2026-06-30T02:00:00Z'
  },
  {
    uid: 'fb_uid_5',
    email: 'hoangthie@gmail.com',
    displayName: 'Hoang Thi E',
    photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    role: 'USER',
    isActive: true,
    providerId: 'google.com',
    storageUsed: 0,
    storageLimit: 1073741824, // 1 GB (Upgraded limit)
    createdAt: '2026-06-18T17:45:00Z',
    updatedAt: '2026-06-30T10:30:00Z'
  },
  {
    uid: 'fb_uid_6',
    email: 'vuongdinhf@gmail.com',
    displayName: 'Vuong Dinh F',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
    role: 'USER',
    isActive: true,
    providerId: 'password',
    storageUsed: 0,
    storageLimit: 104857600, // 100 MB
    createdAt: '2026-06-20T08:12:00Z',
    updatedAt: '2026-06-25T14:50:00Z'
  },
  {
    uid: 'fb_uid_7',
    email: 'buithig@gmail.com',
    displayName: 'Bui Thi G',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    role: 'USER',
    isActive: true,
    providerId: 'google.com',
    storageUsed: 0,
    storageLimit: 104857600,
    createdAt: '2026-06-22T13:40:00Z',
    updatedAt: '2026-06-27T18:22:00Z'
  },
  {
    uid: 'fb_uid_8',
    email: 'ngovanh@gmail.com',
    displayName: 'Ngo Van H',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
    role: 'USER',
    isActive: false,
    providerId: 'password',
    storageUsed: 0,
    storageLimit: 104857600,
    createdAt: '2026-06-01T10:00:00Z',
    updatedAt: '2026-06-03T10:00:00Z'
  },
  {
    uid: 'fb_uid_9',
    email: 'phanhuyi@gmail.com',
    displayName: 'Phan Huy I',
    photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
    role: 'USER',
    isActive: true,
    providerId: 'google.com',
    storageUsed: 0,
    storageLimit: 104857600,
    createdAt: '2026-06-25T15:20:00Z',
    updatedAt: '2026-06-29T11:45:00Z'
  },
  {
    uid: 'fb_uid_10',
    email: 'doanthij@gmail.com',
    displayName: 'Doan Thi J',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    role: 'USER',
    isActive: true,
    providerId: 'google.com',
    storageUsed: 0,
    storageLimit: 104857600,
    createdAt: '2026-06-26T16:00:00Z',
    updatedAt: '2026-06-30T12:00:00Z'
  },
  {
    uid: 'fb_uid_11',
    email: 'dinhvank@gmail.com',
    displayName: 'Dinh Van K',
    photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150',
    role: 'USER',
    isActive: true,
    providerId: 'google.com',
    storageUsed: 0,
    storageLimit: 21474836480, // 20 GB (Heavy storage user)
    createdAt: '2026-05-15T09:30:00Z',
    updatedAt: '2026-06-30T15:00:00Z'
  }
];

// Initialize default mock documents with rich OCR texts
const initialDocuments: Document[] = [
  {
    id: 'doc_1',
    title: 'Hóa đơn tiền điện tháng 06-2026',
    ownerUid: 'fb_uid_1',
    ownerEmail: 'nguyenvana@gmail.com',
    fileSize: 452109, // ~452 KB
    storageUrl: 'https://scanlink-s3.s3.ap-southeast-1.amazonaws.com/docs/doc_1.pdf',
    ocrText: `TỔNG CÔNG TY ĐIỆN LỰC TP. HỒ CHÍ MINH\nHOÁ ĐƠN TIỀN ĐIỆN (HĐ GIÁ TRỊ GIA TĂNG)\nKỳ: 1 Tháng 06/2026\nKhách hàng: NGUYỄN VĂN A\nĐịa chỉ: 123 Đường Lê Lợi, Quận 1, TP.HCM\nMã số thuế: 0102030405\nChỉ số cũ: 14520 kWh - Chỉ số mới: 14780 kWh\nĐiện năng tiêu thụ: 260 kWh\nĐơn giá bình quân: 2,014 VND/kWh\nThành tiền: 523,640 VND\nThuế VAT (10%): 52,364 VND\nTỔNG TIỀN THANH TOÁN: 576,004 VND\nTrạng thái: Đã thanh toán qua Momo.`,
    shareLinksCount: 1,
    createdAt: '2026-06-24T15:55:00Z'
  },
  {
    id: 'doc_2',
    title: 'Chứng minh nhân dân (Mặt trước)',
    ownerUid: 'fb_uid_1',
    ownerEmail: 'nguyenvana@gmail.com',
    fileSize: 854020, // ~854 KB
    storageUrl: 'https://scanlink-s3.s3.ap-southeast-1.amazonaws.com/docs/doc_2.jpg',
    ocrText: `CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM\nĐộc lập - Tự do - Hạnh phúc\nCĂN CƯỚC CÔNG DÂN / CITIZEN IDENTITY CARD\nSố / No.: 012345678912\nHọ và tên / Full name: NGUYỄN VĂN A\nNgày sinh / Date of birth: 15/08/1998\nGiới tính / Sex: Nam\nQuốc tịch / Nationality: Việt Nam\nQuê quán / Place of origin: Hải Hậu, Nam Định\nNơi thường trú / Place of residence: Quận 1, TP. Hồ Chí Minh\nCó giá trị đến / Date of expiry: 15/08/2038`,
    shareLinksCount: 0,
    createdAt: '2026-06-15T08:20:00Z'
  },
  {
    id: 'doc_3',
    title: 'Hợp đồng thuê nhà 2026',
    ownerUid: 'fb_uid_2',
    ownerEmail: 'tranthib@gmail.com',
    fileSize: 3512300, // ~3.5 MB
    storageUrl: 'https://scanlink-s3.s3.ap-southeast-1.amazonaws.com/docs/doc_3.pdf',
    ocrText: `CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM\nĐỘC LẬP - TỰ DO - HẠNH PHÚC\n---\nHỢP ĐỒNG THUÊ NHÀ TRỌ\nHôm nay ngày 12/06/2026 tại TP. Hồ Chí Minh.\nBÊN CHO THUÊ (Bên A): Bùi Văn Tiến - CMND: 025184931\nBÊN THUÊ (Bên B): TRẦN THỊ B - CMND: 025819402\nĐiều 1: Bên A đồng ý cho Bên B thuê căn phòng số 4, nhà 45/12 Đường Xô Viết Nghệ Tĩnh, Quận Bình Thạnh.\nĐiều 2: Giá thuê là 3,500,000 VND/tháng. Đặt cọc 1 tháng tiền nhà.\nĐiều 3: Thời hạn thuê là 01 năm kể từ ngày 15/06/2026 đến hết ngày 15/06/2027.\nKý tên:\nBên A: Bùi Văn Tiến (Đã ký)\nBên B: Trần Thị B (Đã ký)`,
    shareLinksCount: 2,
    createdAt: '2026-06-13T11:00:00Z'
  },
  {
    id: 'doc_4',
    title: 'Hóa đơn mua sắm siêu thị BigC',
    ownerUid: 'fb_uid_2',
    ownerEmail: 'tranthib@gmail.com',
    fileSize: 204350, // ~204 KB
    storageUrl: 'https://scanlink-s3.s3.ap-southeast-1.amazonaws.com/docs/doc_4.jpg',
    ocrText: `SIÊU THỊ BIG C MIỀN ĐÔNG\nĐịa chỉ: 268 Tô Hiến Thành, Quận 10, TP.HCM\nHOÁ ĐƠN BÁN LẺ\nNgày: 28/06/2026 19:30\nThu ngân: Nguyễn Hoa\n1. Sữa tươi Vinamilk 1L x 4 hộp: 148,000 VND\n2. Gạo thơm lài 5kg: 115,000 VND\n3. Trứng gà vỉ 10 quả: 32,000 VND\n4. Dầu ăn Simply 2L: 105,000 VND\n5. Bánh quy Orion: 45,000 VND\nCộng tiền hàng: 445,000 VND\nKhuyến mãi: -20,000 VND\nTổng thanh toán: 425,000 VND\nCảm ơn Quý khách! Hẹn gặp lại!`,
    shareLinksCount: 0,
    createdAt: '2026-06-29T10:00:00Z'
  },
  {
    id: 'doc_5',
    title: 'Bảng điểm Đại học kì 2',
    ownerUid: 'fb_uid_3',
    ownerEmail: 'levanc@outlook.com',
    fileSize: 1845200, // ~1.8 MB
    storageUrl: 'https://scanlink-s3.s3.ap-southeast-1.amazonaws.com/docs/doc_5.pdf',
    ocrText: `TRƯỜNG ĐẠI HỌC BÁCH KHOA - ĐHQG TP.HCM\nBẢNG ĐIỂM TỔNG HỢP HỌC KỲ K25.1\nHọ tên SV: LÊ VĂN C - MSSV: 1812345\nLớp: MT18KH - Ngành: Khoa học máy tính\nSTT | Mã MH | Tên Môn Học | Tín Chỉ | Điểm Số\n1 | CO1027 | Cấu trúc dữ liệu & Giải thuật | 4 | 8.5\n2 | CO2011 | Hệ điều hành | 3 | 7.0\n3 | CO2013 | Cơ sở dữ liệu | 4 | 9.0\n4 | MS1013 | Xác suất thống kê | 3 | 6.5\n5 | CO2039 | Lập trình hướng đối tượng | 3 | 8.0\nĐiểm trung bình học kỳ: 7.96 (Khá)\nTrạng thái học tập: Đang học.`,
    shareLinksCount: 0,
    createdAt: '2026-06-05T14:00:00Z'
  },
  {
    id: 'doc_6',
    title: 'Backup Database Dump SQL (Warning Size)',
    ownerUid: 'fb_uid_4',
    ownerEmail: 'phamminhd@gmail.com',
    fileSize: 5368709120, // 5 GB
    storageUrl: 'https://scanlink-s3.s3.ap-southeast-1.amazonaws.com/docs/doc_6.sql',
    ocrText: `-- PostgreSQL database dump\n-- Dumped from database version 14.5\n-- Dumped by pg_dump version 14.5\n\nSET statement_timeout = 0;\nSET lock_timeout = 0;\nSET idle_in_transaction_session_timeout = 0;\nSET client_encoding = 'UTF8';\nSELECT pg_catalog.set_config('search_path', '', false);\nCREATE TABLE public.users (\n    id uuid NOT NULL,\n    email character varying(255) NOT NULL,\n    password_hash character varying(255) NOT NULL,\n    created_at timestamp with time zone DEFAULT now()\n);\n-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres\n-- [TRUNCATED - BINARY DUMP FILE]`,
    shareLinksCount: 3,
    createdAt: '2026-06-25T23:00:00Z'
  },
  {
    id: 'doc_7',
    title: 'Sổ hộ khẩu gia đình',
    ownerUid: 'fb_uid_4',
    ownerEmail: 'phamminhd@gmail.com',
    fileSize: 4210980, // ~4.2 MB
    storageUrl: 'https://scanlink-s3.s3.ap-southeast-1.amazonaws.com/docs/doc_7.pdf',
    ocrText: `BỘ CÔNG AN\nSỔ HỘ KHẨU\nSố sổ: 820148293\n1. CHỦ HỘ: Phạm Văn Sơn\nSinh năm: 1968\nCMND: 024185932\n2. THÀNH VIÊN: Nguyễn Thị Hoa (Vợ)\nSinh năm: 1972\n3. THÀNH VIÊN: PHẠM MINH D (Con)\nSinh năm: 1999\nCMND: 025194029\nNơi thường trú: 45 Đường số 8, Phường Linh Trung, Thành phố Thủ Đức, TP.HCM\nNgày cấp sổ: 14/05/2012. Ngươi cấp: Thượng tá Bùi Văn Nam.`,
    shareLinksCount: 1,
    createdAt: '2026-05-22T09:15:00Z'
  },
  {
    id: 'doc_8',
    title: 'CV ứng tuyển Software Engineer 2026',
    ownerUid: 'fb_uid_5',
    ownerEmail: 'hoangthie@gmail.com',
    fileSize: 1048576, // 1 MB
    storageUrl: 'https://scanlink-s3.s3.ap-southeast-1.amazonaws.com/docs/doc_8.pdf',
    ocrText: `HOÀNG THỊ E\nSOFTWARE ENGINEER (REACT / NODE.JS)\nEmail: hoangthie@gmail.com | Phone: 0909 123 456\nSUMMARY:\nMore than 3 years of experience in front-end development, specializing in Next.js, TypeScript, and TailwindCSS. Enthusiastic about clean code architectures and building responsive, user-friendly dashboards.\nEXPERIENCE:\n- Frontend Dev at FPT Software (2024 - Present):\n  + Developed React dashboards for corporate clients.\n  + Integrated RESTful APIs and Optimized page speed by 40%.\n- Junior Frontend Dev at VNG Corp (2023 - 2024):\n  + Built mobile-web applications using React and Tailwind.`,
    shareLinksCount: 5,
    createdAt: '2026-06-20T15:00:00Z'
  },
  {
    id: 'doc_9',
    title: 'Hóa đơn GrabCar ride 12-06',
    ownerUid: 'fb_uid_5',
    ownerEmail: 'hoangthie@gmail.com',
    fileSize: 120530, // ~120 KB
    storageUrl: 'https://scanlink-s3.s3.ap-southeast-1.amazonaws.com/docs/doc_9.pdf',
    ocrText: `GRAB VIETNAM\nBIÊN NHẬN DỊCH VỤ / GRAB RECEIPT\nNgày: 12/06/2026 08:45\nMã chuyến đi: ADR-482910-39\nTài xế: Lê Văn Tài (GrabCar 4 chỗ)\nĐiểm đón: 100 Điện Biên Phủ, Quận Bình Thạnh\nĐiểm đến: Tòa nhà Landmark 81, Quận Bình Thạnh\nCước phí di chuyển: 45,000 VND\nPhí cầu đường: 10,000 VND\nTổng thanh toán: 55,000 VND\nPhương thức thanh toán: Moca Wallet. Cảm ơn quý khách!`,
    shareLinksCount: 0,
    createdAt: '2026-06-19T09:00:00Z'
  },
  {
    id: 'doc_10',
    title: 'Đăng ký xe máy Exciter',
    ownerUid: 'fb_uid_6',
    ownerEmail: 'vuongdinhf@gmail.com',
    fileSize: 630120, // ~630 KB
    storageUrl: 'https://scanlink-s3.s3.ap-southeast-1.amazonaws.com/docs/doc_10.jpg',
    ocrText: `CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM\nBỘ CÔNG AN\nCHỨNG NHẬN ĐĂNG KÝ XE MÔ TÔ, XE MÁY\nSố / No.: 0482930\nTên chủ xe: VƯƠNG ĐÌNH F\nĐịa chỉ: Cát Lái, Quận 2, TP.HCM\nNhãn hiệu: YAMAHA   Số loại: EXCITER\nDung tích: 150 cm3   Màu sơn: Xanh-Bạc\nSố máy: G3D8E-149204\nSố khung: 5YP1-294029\nBiển số đăng ký: 59-G2 888.88\nĐăng ký ngày 22/06/2026. Ký tên đóng dấu: Công an TP.HCM.`,
    shareLinksCount: 1,
    createdAt: '2026-06-22T10:00:00Z'
  },
  {
    id: 'doc_11',
    title: 'Giấy khai sinh bản sao',
    ownerUid: 'fb_uid_7',
    ownerEmail: 'buithig@gmail.com',
    fileSize: 954000, // ~954 KB
    storageUrl: 'https://scanlink-s3.s3.ap-southeast-1.amazonaws.com/docs/doc_11.pdf',
    ocrText: `CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM\nỦY BAN NHÂN DÂN PHƯỜNG LINH ĐÔNG, TP. THỦ ĐỨC\nBẢN SAO GIẤY KHAI SINH\nHọ và tên: BÙI THỊ G\nNgày sinh: 20/10/2000   Bằng chữ: Hai mươi tháng mười năm hai ngàn\nNơi sinh: Bệnh viện Từ Dũ, TP.HCM\nGiới tính: Nữ   Dân tộc: Kinh   Quốc tịch: Việt Nam\nHọ tên cha: Bùi Văn Hùng   Dân tộc: Kinh\nHọ tên mẹ: Nguyễn Thị Lan   Dân tộc: Kinh\nNơi đăng ký khai sinh: UBND Phường Linh Đông.\nSao lục từ sổ đăng ký ngày 24/06/2026. Ký thay: Chủ tịch Phường.`,
    shareLinksCount: 0,
    createdAt: '2026-06-24T14:00:00Z'
  },
  {
    id: 'doc_12',
    title: 'Dataset lưu trữ ảnh RAW chất lượng cao',
    ownerUid: 'fb_uid_11',
    ownerEmail: 'dinhvank@gmail.com',
    fileSize: 16106127360, // 15 GB
    storageUrl: 'https://scanlink-s3.s3.ap-southeast-1.amazonaws.com/docs/doc_12.zip',
    ocrText: `ZIP Archive File containing high definition raw camera scans.\nCamera Model: Sony Alpha 7 IV\nImage counts: 450 RAW files\nAverage size per image: 35MB\n[EXIF METADATA DETECTED]\nISO: 100, F/2.8, 1/125s\nColor profile: AdobeRGB\nExtracted tags: Portait, Studio, Summer-2026`,
    shareLinksCount: 4,
    createdAt: '2026-06-20T08:00:00Z'
  },
  {
    id: 'doc_13',
    title: 'Hóa đơn dịch vụ AWS tháng 05-2026',
    ownerUid: 'fb_uid_11',
    ownerEmail: 'dinhvank@gmail.com',
    fileSize: 1254300, // ~1.25 MB
    storageUrl: 'https://scanlink-s3.s3.ap-southeast-1.amazonaws.com/docs/doc_13.pdf',
    ocrText: `AMAZON WEB SERVICES BILLING RECEIPT\nInvoice ID: AWS-2026-84920\nBilling Period: May 1, 2026 - May 31, 2026\nAccount Owner: DINH VAN K\nTotal amount due: $1,452.80 USD\nServices breakdown:\n- Amazon Elastic Compute Cloud (EC2): $680.20\n- Amazon Simple Storage Service (S3): $420.50 (Storage: 15TB raw data)\n- Amazon Relational Database Service (RDS): $252.10\n- AWS Data Transfer: $100.00\nPayment charged automatically via Visa ending in 4820.`,
    shareLinksCount: 1,
    createdAt: '2026-06-02T03:00:00Z'
  }
];

// In-memory database persistence
let users: User[] = [];
let documents: Document[] = [];

export function initializeDatabase() {
  if (typeof window !== 'undefined') {
    // Client-side local storage persistence
    const savedUsers = localStorage.getItem('scanlink_users');
    const savedDocs = localStorage.getItem('scanlink_docs');
    
    if (savedUsers) {
      users = JSON.parse(savedUsers);
    } else {
      users = [...initialUsers];
      saveUsersToLocalStorage();
    }
    
    if (savedDocs) {
      documents = JSON.parse(savedDocs);
    } else {
      documents = [...initialDocuments];
      recalculateStorageUsed();
      saveDocsToLocalStorage();
    }
  } else {
    // Server-side global storage persistence (to keep memory alive during dev)
    const globalStore = global as any;
    if (!globalStore._scanlinkUsers) {
      globalStore._scanlinkUsers = [...initialUsers];
    }
    if (!globalStore._scanlinkDocs) {
      globalStore._scanlinkDocs = [...initialDocuments];
      // Compute initial storageUsed
      const tempDocs = globalStore._scanlinkDocs as Document[];
      const tempUsers = globalStore._scanlinkUsers as User[];
      tempUsers.forEach((u: User) => {
        const uDocs = tempDocs.filter((d: Document) => d.ownerUid === u.uid);
        u.storageUsed = uDocs.reduce((acc: number, curr: Document) => acc + curr.fileSize, 0);
      });
    }
    users = globalStore._scanlinkUsers;
    documents = globalStore._scanlinkDocs;
  }
}

function saveUsersToLocalStorage() {
  const globalStore = global as any;
  if (typeof window !== 'undefined') {
    localStorage.setItem('scanlink_users', JSON.stringify(users));
  } else if (globalStore._scanlinkUsers) {
    globalStore._scanlinkUsers = users;
  }
}

function saveDocsToLocalStorage() {
  const globalStore = global as any;
  if (typeof window !== 'undefined') {
    localStorage.setItem('scanlink_docs', JSON.stringify(documents));
  } else if (globalStore._scanlinkDocs) {
    globalStore._scanlinkDocs = documents;
  }
}

function recalculateStorageUsed() {
  users.forEach(u => {
    const userDocs = documents.filter(d => d.ownerUid === u.uid);
    u.storageUsed = userDocs.reduce((acc, curr) => acc + curr.fileSize, 0);
  });
  saveUsersToLocalStorage();
}

// 30-Day Activity charts generation helper (relative to current date)
export function getChartData(days = 30) {
  const registrationChart: { date: string; count: number }[] = [];
  const uploadChart: { date: string; count: number }[] = [];
  
  // Set deterministic seeds for registration/upload count generation
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    
    // Seed-like calculation based on day of month for visual dynamism
    const daySeed = d.getDate();
    const regCount = Math.floor((daySeed % 7) * 3 + (daySeed % 4) * 2 + 5);
    const uploadCount = Math.floor((daySeed % 5) * 25 + (daySeed % 3) * 15 + 80);
    
    registrationChart.push({ date: dateStr, count: regCount });
    uploadChart.push({ date: dateStr, count: uploadCount });
  }

  // Count authentication providers from database
  const providers: Record<string, number> = {
    'google.com': 0,
    'password': 0
  };
  
  users.forEach(u => {
    const p = u.providerId === 'google.com' ? 'google.com' : 'password';
    providers[p]++;
  });

  return {
    registrationChart,
    uploadChart,
    providerDistribution: providers
  };
}

export const MockDatabase = {
  // Statistics API
  getStats: () => {
    initializeDatabase();
    const totalUsers = users.length;
    const totalDocuments = documents.length;
    const totalStorageUsedBytes = users.reduce((acc, u) => acc + u.storageUsed, 0);
    const activeUsers30Days = users.filter(u => u.isActive).length; // Active count mock
    
    // Aggregate storage limit maxes (mock total storage capacity pool)
    const storageLimitMaxBytes = 536870912000; // 500 GB total pool
    
    return {
      totalUsers,
      totalDocuments,
      totalStorageUsedBytes,
      activeUsers30Days,
      storageLimitMaxBytes
    };
  },

  // Charts API
  getCharts: (days = 30) => {
    initializeDatabase();
    return getChartData(days);
  },

  // Users Administration API
  getUsers: (page = 0, size = 20, search = '', isActive?: boolean) => {
    initializeDatabase();
    let filtered = [...users];
    
    // Apply search filter
    if (search.trim() !== '') {
      const q = search.toLowerCase();
      filtered = filtered.filter(u => 
        u.displayName.toLowerCase().includes(q) || 
        u.email.toLowerCase().includes(q)
      );
    }
    
    // Apply status filter
    if (isActive !== undefined) {
      filtered = filtered.filter(u => u.isActive === isActive);
    }
    
    // Sort so admins or latest users are high
    filtered.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    
    const totalElements = filtered.length;
    const totalPages = Math.ceil(totalElements / size);
    const startIdx = page * size;
    const paginatedContent = filtered.slice(startIdx, startIdx + size);
    
    return {
      content: paginatedContent,
      pageable: { pageNumber: page, pageSize: size },
      totalElements,
      totalPages,
      last: page >= totalPages - 1
    };
  },

  // Toggle user status
  updateUserStatus: (uid: string, isActive: boolean) => {
    initializeDatabase();
    const userIndex = users.findIndex(u => u.uid === uid);
    if (userIndex === -1) return null;
    
    users[userIndex].isActive = isActive;
    users[userIndex].updatedAt = new Date().toISOString();
    saveUsersToLocalStorage();
    return users[userIndex];
  },

  // Update user storage quota limit
  updateUserQuota: (uid: string, storageLimitBytes: number) => {
    initializeDatabase();
    const userIndex = users.findIndex(u => u.uid === uid);
    if (userIndex === -1) return null;
    
    users[userIndex].storageLimit = storageLimitBytes;
    users[userIndex].updatedAt = new Date().toISOString();
    saveUsersToLocalStorage();
    return users[userIndex];
  },

  // Get system documents
  getDocuments: (page = 0, size = 20, search = '', ownerUid = '') => {
    initializeDatabase();
    let filtered = [...documents];
    
    // Search by document title
    if (search.trim() !== '') {
      const q = search.toLowerCase();
      filtered = filtered.filter(d => d.title.toLowerCase().includes(q));
    }
    
    // Filter by ownerUid
    if (ownerUid.trim() !== '') {
      filtered = filtered.filter(d => d.ownerUid === ownerUid);
    }
    
    // Sort latest uploads first
    filtered.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    
    const totalElements = filtered.length;
    const totalPages = Math.ceil(totalElements / size);
    const startIdx = page * size;
    const paginatedContent = filtered.slice(startIdx, startIdx + size);
    
    return {
      content: paginatedContent,
      pageable: { pageNumber: page, pageSize: size },
      totalElements,
      totalPages,
      last: page >= totalPages - 1
    };
  },

  // Force delete document
  deleteDocument: (id: string) => {
    initializeDatabase();
    const docIndex = documents.findIndex(d => d.id === id);
    if (docIndex === -1) return false;
    
    documents.splice(docIndex, 1);
    recalculateStorageUsed();
    saveDocsToLocalStorage();
    return true;
  }
};
