// Dữ liệu các dự án thiết kế nội thất
const projects = [
    {
        id: 1,
        title: "Căn Hộ Hiện Đại Phong Cách Scandinavian",
        style: "Scandinavian",
        beforeImage: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
        afterImage: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
        description: "Thiết kế căn hộ với phong cách Scandinavian tối giản, sử dụng tông màu trắng và gỗ tự nhiên tạo không gian thoáng đãng và ấm cúng.",
        costItems: [
            "Thiết kế và lập hồ sơ kỹ thuật",
            "Sơn tường và trần nhà",
            "Lắp đặt sàn gỗ tự nhiên",
            "Nội thất phòng khách (ghế sofa, bàn trà, kệ TV)",
            "Nội thất phòng ngủ (giường, tủ quần áo, bàn trang điểm)",
            "Thiết bị chiếu sáng và đèn trang trí",
            "Rèm cửa và phụ kiện trang trí"
        ],
        totalCost: "350.000.000 VNĐ"
    },
    {
        id: 2,
        title: "Biệt Thự Sang Trọng Phong Cách Classic",
        style: "Classic",
        beforeImage: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&h=600&fit=crop",
        afterImage: "https://images.unsplash.com/photo-1615873968403-89e068629265?w=800&h=600&fit=crop",
        description: "Thiết kế biệt thự với phong cách Classic sang trọng, sử dụng vật liệu cao cấp và đồ nội thất tinh xảo.",
        costItems: [
            "Thiết kế và giám sát thi công",
            "Thi công phần thô (sơn, trần, sàn)",
            "Sàn đá marble cao cấp",
            "Nội thất phòng khách (ghế bành, tủ kệ, đồ trang trí)",
            "Nội thất phòng ngủ master (giường, tủ, bàn)",
            "Nội thất phòng bếp (tủ bếp, thiết bị)",
            "Hệ thống đèn chùm và chiếu sáng",
            "Rèm cửa và vải bọc nội thất",
            "Đồ trang trí và phụ kiện"
        ],
        totalCost: "1.200.000.000 VNĐ"
    },
    {
        id: 3,
        title: "Nhà Phố Hiện Đại Phong Cách Industrial",
        style: "Industrial",
        beforeImage: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
        afterImage: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
        description: "Thiết kế nhà phố với phong cách Industrial độc đáo, kết hợp gạch thô, kim loại và ánh sáng công nghiệp.",
        costItems: [
            "Thiết kế concept và 3D",
            "Thi công phần thô",
            "Sơn tường và xử lý gạch thô",
            "Sàn bê tông mài",
            "Nội thất phòng khách (ghế sofa da, bàn gỗ, kệ kim loại)",
            "Nội thất phòng ngủ",
            "Hệ thống đèn công nghiệp",
            "Cửa và cửa sổ",
            "Thiết bị vệ sinh"
        ],
        totalCost: "450.000.000 VNĐ"
    },
    {
        id: 4,
        title: "Studio Nhỏ Phong Cách Minimalist",
        style: "Minimalist",
        beforeImage: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=600&fit=crop",
        afterImage: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
        description: "Thiết kế studio nhỏ gọn với phong cách Minimalist, tối ưu không gian và tạo cảm giác rộng rãi.",
        costItems: [
            "Thiết kế tối ưu không gian",
            "Sơn tường và trần",
            "Sàn gỗ công nghiệp",
            "Nội thất đa năng (giường sofa, bàn làm việc)",
            "Tủ lưu trữ thông minh",
            "Hệ thống chiếu sáng LED",
            "Rèm cửa và phụ kiện"
        ],
        totalCost: "180.000.000 VNĐ"
    },
    {
        id: 5,
        title: "Penthouse Cao Cấp Phong Cách Luxury",
        style: "Luxury",
        beforeImage: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
        afterImage: "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&h=600&fit=crop",
        description: "Thiết kế penthouse cao cấp với phong cách Luxury, sử dụng vật liệu và nội thất đẳng cấp quốc tế.",
        costItems: [
            "Thiết kế và tư vấn chuyên sâu",
            "Thi công phần thô cao cấp",
            "Sàn đá tự nhiên nhập khẩu",
            "Nội thất nhập khẩu từ châu Âu",
            "Hệ thống đèn chùm pha lê",
            "Thiết bị nhà bếp và phòng tắm cao cấp",
            "Hệ thống rèm tự động",
            "Đồ trang trí và nghệ thuật",
            "Giám sát và bảo hành"
        ],
        totalCost: "2.500.000.000 VNĐ"
    },
    {
        id: 6,
        title: "Nhà Cấp 4 Phong Cách Rustic",
        style: "Rustic",
        beforeImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
        afterImage: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&h=600&fit=crop",
        description: "Thiết kế nhà cấp 4 với phong cách Rustic ấm cúng, sử dụng gỗ tự nhiên và vật liệu thô mộc.",
        costItems: [
            "Thiết kế và lập hồ sơ",
            "Thi công phần thô",
            "Sàn gỗ tự nhiên",
            "Nội thất gỗ thủ công",
            "Thiết bị chiếu sáng",
            "Rèm cửa và phụ kiện",
            "Đồ trang trí Rustic"
        ],
        totalCost: "280.000.000 VNĐ"
    }
];

