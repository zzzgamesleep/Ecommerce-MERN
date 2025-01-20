import Order from "../model/Order.model.js";
import Product from "../model/Product.model.js";
import User from "../model/User.model.js"

export const getAnalyticsData = async () => {
    const TotalUser = await User.countDocuments();
    const TotalProducts = await Product.countDocuments();
    const salesData = await Order.aggregate([
        {
            $group: {
                _id: null,
                totalSales: { $sum: 1 },
                totalRevenue: { $sum: "$totalAmount" }
            }
        }
    ])
    const { totalSales, totalRevenue } = salesData[0] || { totalSales:0, totalRevenue:0 }
    return {
        users: TotalUser,
        products: TotalProducts,
        totalSales,
        totalRevenue
    }
}
export const getDailySalesData = async (startDate, endDate) => {
    try {   
        const dailySalesData = await Order.aggregate([
            // Tạo một pipeline để lọc các đơn hàng trong khoảng thời gian đã cho
            {
                $match: {
                    createdAt: {
                        $gte: startDate, // Lớn hơn hoặc bằng ngày bắt đầu
                        $lte: endDate, // Nhỏ hơn hoặc bằng ngày kết thúc
                    },
                },
            },
            // Nhóm các đơn hàng theo ngày và tính tổng số đơn hàng và doanh thu
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, // Tạo một trường _id chứa ngày tháng năm
                    sales: { $sum: 1 }, // Đếm số lượng đơn hàng
                    revenue: { $sum: "$totalAmount" }, // Tính tổng doanh thu
                },
            },
            // Sắp xếp kết quả theo ngày tăng dần
            { $sort: { _id: 1 } },
        ]);
        /*
          exple for dailySalesData 
          {
             _id: "2024-08-18", 
             sales: 12, 
             revenue: 1450.75 
          }
        */
        const DateArray = getDatesInRange(startDate,endDate);
    
        return DateArray.map(date => {
            const foundData = dailySalesData.find(item => item._id === date);
    
                return {
                    date,
                    sales: foundData?.sales || 0,
                    revenue: foundData?.revenue || 0,
                }
        });
    } catch (error) {
        throw error;
    }
}
function getDatesInRange(startDate, endDate) {
    const dates = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) { // Sử dụng currentDate thay vì startDate
        dates.push(currentDate.toISOString().split("T")[0]); // Format đúng ngày
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
}
