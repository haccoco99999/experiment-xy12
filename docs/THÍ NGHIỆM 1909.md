# THÍ NGHIỆM 1

# **THÍ NGHIỆM 1**

## **TÌM HIỂU CÁC YẾU TỐ CẦN THIẾT CHO SỰ SỐNG VÀ PHÁT TRIỂN CỦA THỰC VẬT**

### **1\. Mục đích của thí nghiệm**

Website mô phỏng một thí nghiệm tương tác dành cho học sinh tiểu học, trong đó học sinh được trực tiếp thao tác với cây đậu xanh và thay đổi các điều kiện môi trường để quan sát ảnh hưởng của từng yếu tố đến sự sống và phát triển của cây.

Năm yếu tố được khảo sát gồm:

1. Nước.  
2. Chất khoáng.  
3. Không khí.  
4. Ánh sáng.  
5. Nhiệt độ thích hợp.

Thí nghiệm sử dụng hai chậu cây:

* **Chậu A:** Chậu đối chứng, luôn được duy trì đầy đủ các điều kiện thích hợp.  
* **Chậu B:** Chậu thí nghiệm, cho phép học sinh thay đổi các điều kiện môi trường.

Mục tiêu của giao diện là tạo cảm giác như học sinh đang thực hiện một thí nghiệm thật trên bàn thí nghiệm ngoài sân vườn.

---

# **2\. CẤU TRÚC TỔNG THỂ WEBSITE**

Màn hình thí nghiệm được chia thành 3 khu vực chính:

### **Khu vực 1 – Khay dụng cụ**

Nằm cố định ở phía bên trái màn hình.

Đây là nơi chứa toàn bộ vật dụng mà học sinh có thể sử dụng trong thí nghiệm.

### **Khu vực 2 – Bàn thí nghiệm**

Nằm ở trung tâm màn hình.

Đây là khu vực học sinh kéo – thả các chậu cây và dụng cụ để thiết lập điều kiện thí nghiệm.

### **Khu vực 3 – Bảng điều khiển**

Bao gồm:

* Thanh tiến trình.  
* Bảng điều khiển nhiệt độ.  
* Nút “BẮT ĐẦU THÍ NGHIỆM”.  
* Thông tin của hai chậu cây.  
* Nút “LÀM LẠI THÍ NGHIỆM”.

---

# **3\. BỐI CẢNH GIAO DIỆN**

Bối cảnh chính của website là một **sân vườn ngoài trời**.

Trung tâm màn hình có một **bàn thí nghiệm bằng gỗ**.

Không gian xung quanh cần tạo cảm giác:

* Có ánh sáng tự nhiên.  
* Có không khí ngoài trời.  
* Có nền sân vườn.  
* Không gian đủ rộng.  
* Hai chậu cây có thể đặt cạnh nhau.  
* Các dụng cụ có thể được kéo từ khay bên trái lên bàn.

Giao diện cần ưu tiên:

* Hình ảnh trực quan.  
* Nút bấm lớn.  
* Màu sắc dễ phân biệt.  
* Chữ dễ đọc.  
* Thao tác kéo – thả đơn giản.  
* Phản hồi ngay sau mỗi thao tác.

Đối tượng sử dụng chính là học sinh tiểu học nên hạn chế các thao tác phức tạp.

---

# **4\. NÚT “LÀM lại thí nghiệm”**

Ở góc dưới bên phải màn hình luôn hiển thị nút:

**LÀM LẠI THÍ NGHIỆM**

Nút phải có kích thước đủ lớn để học sinh dễ nhận biết và nhấp vào.

Nút này luôn khả dụng, kể cả khi:

* Học sinh đang chuẩn bị thí nghiệm.  
* Học sinh đã bắt đầu thí nghiệm.  
* Hệ thống đang tua nhanh thời gian.  
* Kết quả thí nghiệm đã xuất hiện.

## **4.1. Khi nhấn “LÀM LẠI THÍ NGHIỆM”**

Hệ thống mở hộp thoại xác nhận:

**“Em có chắc muốn làm lại thí nghiệm không?”**

Bên dưới hiển thị hai nút:

**HỦY | LÀM LẠI**

## **4.2. Nếu chọn “HỦY”**

Hệ thống:

* Đóng hộp thoại.  
* Không thay đổi bất kỳ trạng thái nào.  
* Giữ nguyên toàn bộ tiến trình hiện tại.

## **4.3. Nếu chọn “LÀM LẠI”**

Hệ thống đưa toàn bộ thí nghiệm về trạng thái ban đầu.

Cụ thể:

1. Dừng toàn bộ hiệu ứng đang chạy.  
2. Đưa thời gian về trạng thái ban đầu.  
3. Đưa chậu A về trạng thái ban đầu.  
4. Đưa chậu B về trạng thái ban đầu.  
5. Xóa toàn bộ lượng nước đã tưới.  
6. Khôi phục trạng thái đất ban đầu.  
7. Xóa lượng phân bón đã sử dụng.  
8. Hủy trạng thái che sáng.  
9. Hủy trạng thái ngăn trao đổi không khí.  
10. Đưa nhiệt độ về **28°C**.  
11. Xóa toàn bộ kết quả quan sát.  
12. Đưa toàn bộ dụng cụ trở lại khay vật liệu bên trái.  
13. Đưa bàn thí nghiệm về trạng thái trống.  
14. Đưa thanh tiến trình về bước đầu tiên.  
15. Khóa lại các bước chưa được thực hiện.

Nút **“LÀM LẠI THÍ NGHIỆM”** vẫn tiếp tục được hiển thị sau khi reset.

---

# **5\. KHAY DỤNG CỤ THÍ NGHIỆM**

Khay dụng cụ được đặt cố định ở bên trái màn hình.

Học sinh phải thực hiện thao tác:

**KÉO → THẢ**

để đưa dụng cụ từ khay lên bàn thí nghiệm.

Khay gồm:

1. Chậu cây A.  
2. Chậu cây B.  
3. Bình tưới nước.  
4. Chậu đất sỏi rửa sạch.  
5. Phân NPK.  
6. Thùng nhựa đen che sáng.  
7. Thùng trong suốt có viền được dán kín.

Các dụng cụ cần có hình ảnh trực quan và dễ nhận biết.

---

# **6\. CHẬU A – CHẬU ĐỐI CHỨNG**

Chậu A là mẫu đối chứng.

Chậu A có đặc điểm:

* Cây đậu xanh 15 ngày tuổi.  
* Chiều cao: 10 cm.  
* Có 5 lá xanh.  
* Rễ đâm sâu trong đất.  
* Đất nền giàu dinh dưỡng.  
* Cây khỏe mạnh.  
* Cây phát triển đồng đều.

Chậu được thiết kế theo dạng **mặt cắt dọc 1/2** để học sinh nhìn thấy toàn bộ bộ rễ.

Bộ rễ:

* Có màu trắng.  
* Nằm chìm trong đất.  
* Có thể nhìn thấy chiều dài.  
* Thể hiện rõ hướng rễ đâm sâu xuống đất.  
* Có thể quan sát sự phát triển của rễ sau thí nghiệm.

## **6.1. Quy tắc tương tác của chậu A**

Chậu A **không được phép thay đổi điều kiện môi trường**.

Sau khi học sinh kéo chậu A lên bàn:

* Hệ thống tự động xác nhận chậu A đã có đủ 5 yếu tố.  
* Không xuất hiện thao tác kéo – thả để thay đổi môi trường cho chậu A.  
* Không cho phép đặt thùng đen lên chậu A.  
* Không cho phép đặt thùng trong suốt lên chậu A.  
* Không cho phép thay đất.  
* Không cho phép thay đổi lượng nước.  
* Không cho phép điều chỉnh nhiệt độ riêng cho chậu A.

Chậu A luôn duy trì điều kiện thích hợp để làm mẫu đối chứng.

## **6.2. Thông tin điều kiện của chậu A**

Hệ thống luôn ghi nhận:

* **Nước: Có**  
* **Chất khoáng: Có**  
* **Không khí: Có**  
* **Ánh sáng: Có**  
* **Nhiệt độ: Thích hợp 20–30°C**

Học sinh chỉ được quan sát chậu A.

---

# **7\. CHẬU B – CHẬU THÍ NGHIỆM**

Chậu B có cùng trạng thái ban đầu với chậu A:

* Cây đậu xanh 15 ngày tuổi.  
* Cao 10 cm.  
* Có 5 lá xanh.  
* Cây tươi tốt.  
* Cây khỏe mạnh.  
* Phát triển đồng đều.  
* Rễ màu trắng và đâm sâu trong đất.

Điểm khác biệt là chậu B cho phép học sinh **chủ động thay đổi các yếu tố môi trường**.

Học sinh có thể lựa chọn:

* Có hoặc không có nước.  
* Có hoặc không có chất khoáng.  
* Có hoặc không có ánh sáng.  
* Có hoặc không có trao đổi không khí.  
* Điều chỉnh nhiệt độ từ 0°C đến 60°C.

Các yếu tố có thể được thiết lập theo bất kỳ thứ tự nào.

Không bắt buộc học sinh phải thử từng yếu tố theo một thứ tự cố định.

---

# **8\. BẢNG THÔNG TIN CHẬU CÂY**

Khi học sinh nhấp vào chậu A hoặc chậu B, hệ thống hiển thị bảng thông tin.

| Thông tin | Chậu A | Chậu B |
| ----- | ----- | ----- |
| Độ tuổi | 15 ngày tuổi | 15 ngày tuổi |
| Chiều cao | 10 cm | 10 cm |
| Số lượng lá | 5 lá xanh | 5 lá xanh |
| Giống | Cây đậu xanh | Cây đậu xanh |
| Tình trạng cây | Tươi tốt, khỏe mạnh, phát triển đồng đều | Tươi tốt, khỏe mạnh, phát triển đồng đều |

Bảng thông tin chỉ có chức năng **cung cấp thông tin**.

Việc mở hoặc đóng bảng không làm thay đổi trạng thái thí nghiệm.

---

# **9\. BẢNG ĐIỀU KHIỂN NHIỆT ĐỘ**

Khu vực điều khiển nhiệt độ có một lồng kính/bộ điều khiển với bảng điện tử hiển thị nhiệt độ.

## **9.1. Nhiệt độ mặc định**

Khi bắt đầu:

**28°C**

Bảng điều khiển gồm:

**\[-\] 28°C \[+\]**

## **9.2. Nút tăng nhiệt độ**

Mỗi lần nhấn **\[+\]**, nhiệt độ tăng 1°C.

Ví dụ:

28 → 29 → 30 → 31 → 32 → ...

Giá trị cao nhất:

**60°C**

## **9.3. Nút giảm nhiệt độ**

Mỗi lần nhấn **\[-\]**, nhiệt độ giảm 1°C.

Ví dụ:

28 → 27 → 26 → 25 → ...

Giá trị thấp nhất:

**0°C**

## **9.4. Phạm vi**

Nhiệt độ cho phép:

**0°C – 60°C**

Nhiệt độ được thiết lập sẽ áp dụng cho **chậu B**.

Chậu A vẫn giữ điều kiện thích hợp và không bị ảnh hưởng bởi việc điều chỉnh nhiệt độ của học sinh.

---

# **10\. THANH TIẾN TRÌNH**

Phía trên bàn thí nghiệm hiển thị thanh tiến trình gồm 4 giai đoạn:

**Đặt cây → Thiết lập điều kiện → Bắt đầu thí nghiệm → Quan sát kết quả**

Thanh tiến trình giúp học sinh biết mình đang ở giai đoạn nào.

## **Giai đoạn 1**

**ĐẶT CÂY**

Học sinh cần đặt đủ hai chậu A và B lên bàn.

## **Giai đoạn 2**

**THIẾT LẬP ĐIỀU KIỆN**

Học sinh thay đổi các điều kiện của chậu B.

## **Giai đoạn 3**

**BẮT ĐẦU THÍ NGHIỆM**

Hệ thống khóa thiết lập và bắt đầu mô phỏng quá trình phát triển.

## **Giai đoạn 4**

**QUAN SÁT KẾT QUẢ**

Hệ thống tua nhanh thời gian và hiển thị trạng thái cây sau 14 ngày.

---

# **11\. BƯỚC 1 – ĐẶT HAI CHẬU CÂY**

Học sinh phải kéo:

**Chậu A → Bàn thí nghiệm**

sau đó:

**Chậu B → Bàn thí nghiệm**

Sau khi đặt đúng:

* Hai chậu được cố định trên bàn.  
* Hệ thống chuyển sang bước thiết lập điều kiện.

## **11.1. Nếu kéo dụng cụ khác trước khi đặt cây**

Nếu học sinh cố gắng kéo bình tưới, đất, phân bón hoặc các dụng cụ khác trước khi đặt cây:

* Dụng cụ tự động quay trở lại khay.  
* Hiển thị thông báo:

**“Hãy đặt chậu cây lên bàn trước.”**

---

# **12\. THIẾT LẬP CHẬU A**

Ngay sau khi chậu A được đặt lên bàn:

Hệ thống tự động xác nhận:

**CHẬU A – ĐỐI CHỨNG**

Hiển thị các điều kiện:

* Nước ✓  
* Chất khoáng ✓  
* Không khí ✓  
* Ánh sáng ✓  
* Nhiệt độ thích hợp ✓

Chậu A không có thao tác thay đổi điều kiện.

---

# **13\. THIẾT LẬP CHẬU B**

Chậu B là khu vực tương tác chính.

Học sinh có thể kéo các dụng cụ theo bất kỳ thứ tự nào.

---

# **14\. YẾU TỐ NƯỚC**

Học sinh kéo **bình tưới nước** từ khay bên trái đến chậu B.

## **Khi kéo đúng**

Nếu bình tưới được đưa đúng vị trí:

* Nước được tưới vào đất.  
* Đất chuyển sang trạng thái ẩm.  
* Chậu B được ghi nhận:

**Có nước**

## **Khi kéo sai**

Nếu học sinh kéo bình tưới ra ngoài vị trí chậu:

Hiển thị:

**“Hãy đưa bình tưới đến chậu cây.”**

Bình tưới tự động quay về vị trí gần nhất hoặc vị trí ban đầu trong khay.

## **Nếu không tưới nước**

Chậu B được ghi nhận:

**Thiếu nước**

---

# **15\. YẾU TỐ CHẤT KHOÁNG**

Học sinh có thể sử dụng **chậu đất sỏi rửa sạch** để thay cho đất giàu dinh dưỡng.

Học sinh kéo chậu đất sỏi đến vị trí chậu B.

## **Khi kéo đúng**

Đất của chậu B chuyển sang trạng thái:

**Đất sỏi – không có chất khoáng**

Hệ thống ghi nhận:

**Thiếu chất khoáng**

## **Khi kéo sai**

Hiển thị:

**“Hãy đặt chậu đất sỏi vào vị trí của chậu B.”**

Chậu đất sỏi tự động trở lại vị trí ban đầu.

---

# **16\. BỔ SUNG PHÂN NPK**

Sau khi thay đất, học sinh có thể sử dụng phân NPK.

Học sinh kéo **bịch phân NPK** vào chậu B.

Nếu thao tác đúng:

* Phân được đưa vào đất.  
* Đất trở lại trạng thái có chất khoáng.  
* Hệ thống cập nhật:

**Có chất khoáng**

---

# **17\. YẾU TỐ ÁNH SÁNG**

Học sinh kéo **thùng nhựa đen che sáng** từ khay đến chậu B.

## **Khi kéo đúng**

Thùng được úp kín chậu B.

Môi trường bên trong chuyển sang:

**Thiếu ánh sáng**

Không gian bên trong trở nên tối.

## **Khi kéo sai**

Hiển thị:

**“Hãy úp thùng đen kín chậu cây.”**

Thùng tự động quay về vị trí gần nhất.

## **Nếu không sử dụng thùng đen**

Chậu B được ghi nhận:

**Có ánh sáng**

---

# **18\. YẾU TỐ KHÔNG KHÍ**

Học sinh kéo **thùng trong suốt có viền dán kín** đến chậu B.

## **Khi kéo đúng**

Thùng được úp kín chậu.

Khi đó:

* Không khí bên trong không được trao đổi với môi trường bên ngoài.  
* Thành thùng xuất hiện hơi nước ngưng tụ.  
* Hệ thống ghi nhận:

**Thiếu không khí**

## **Khi kéo sai**

Hiển thị:

**“Hãy úp thùng trong suốt kín chậu cây.”**

Thùng tự động trở về vị trí gần nhất.

## **Nếu không sử dụng thùng**

Chậu B được ghi nhận:

**Có không khí**

---

# **19\. YẾU TỐ NHIỆT ĐỘ**

Nhiệt độ mặc định:

**28°C**

Học sinh sử dụng hai nút:

**\[-\]** và **\[+\]**

để điều chỉnh.

Phạm vi:

**0°C – 60°C**

Khi học sinh nhấn:

**BẮT ĐẦU THÍ NGHIỆM**

hệ thống lấy giá trị nhiệt độ cuối cùng được thiết lập làm điều kiện của chậu B.

---

# **20\. NÚT “BẮT ĐẦU THÍ NGHIỆM”**

Sau khi thiết lập các điều kiện cho chậu B, học sinh nhấn:

**BẮT ĐẦU THÍ NGHIỆM**

Hệ thống kiểm tra 5 nhóm điều kiện:

1. Nước.  
2. Chất khoáng.  
3. Không khí.  
4. Ánh sáng.  
5. Nhiệt độ.

Sau khi kiểm tra:

* Khóa toàn bộ thao tác thiết lập môi trường.  
* Không cho phép kéo thêm dụng cụ.  
* Không cho phép thay đổi đất.  
* Không cho phép thay đổi nước.  
* Không cho phép thay đổi ánh sáng.  
* Không cho phép thay đổi không khí.  
* Không cho phép điều chỉnh nhiệt độ.  
* Bắt đầu quá trình mô phỏng.

---

# **21\. TUA NHANH THỜI GIAN**

Sau khi bắt đầu thí nghiệm, hệ thống hiển thị hiệu ứng tua nhanh.

Mốc thời gian:

**Ngày 1 → Ngày 3 → Ngày 7 → Ngày 14**

Trong quá trình tua nhanh, cây ở chậu A và chậu B thay đổi dựa trên điều kiện đã thiết lập.

Sau khi kết thúc:

# **14 NGÀY SAU**

Hệ thống chuyển sang màn hình quan sát kết quả.

---

# **22\. KẾT QUẢ CHẬU A – ĐỦ 5 YẾU TỐ**

Chậu A luôn có đầy đủ:

**Nước \+ Chất khoáng \+ Không khí \+ Ánh sáng \+ Nhiệt độ thích hợp**

Sau 14 ngày:

### **Thân và lá**

* Thân cây vươn cao.  
* Chiều cao tăng từ **10 cm lên 25 cm**.  
* Lá vẫn xanh mượt.  
* Lá mở rộng.  
* Cây phát triển khỏe mạnh.  
* Tổng thể cây tươi tốt.

### **Bộ rễ**

Do chậu được thiết kế dạng mặt cắt dọc 1/2 nên học sinh có thể quan sát:

* Rễ đâm sâu.  
* Rễ tỏa rộng.  
* Rễ phát triển mạnh.  
* Rễ bám chắc vào đất.

Chậu A đóng vai trò là hình ảnh tham chiếu để học sinh so sánh với chậu B.

---

# **23\. KẾT QUẢ CHẬU B – TRƯỜNG HỢP THIẾU CHẤT KHOÁNG**

## **Điều kiện**

* Có nước.  
* Có không khí.  
* Có ánh sáng.  
* Nhiệt độ thích hợp.  
* Thiếu chất khoáng.

## **Sau 14 ngày**

Đất:

* Chủ yếu là sỏi.  
* Khô cằn.  
* Không có màu đất giàu dinh dưỡng.

Thân:

* Mảnh dẻ.  
* Còi cọc.  
* Phát triển kém.

Lá:

* Nhỏ.  
* Vàng nhạt.

Rễ:

* Ngắn.  
* Thưa thớt.  
* Phát triển yếu.

## **Kết quả**

**Cây sống còi cọc, suy yếu.**

---

# **24\. KẾT QUẢ CHẬU B – TRƯỜNG HỢP THIẾU NƯỚC**

## **Điều kiện**

* Có chất khoáng.  
* Có không khí.  
* Có ánh sáng.  
* Nhiệt độ thích hợp.  
* Không được tưới nước.

## **Sau 14 ngày**

Đất:

* Khô.  
* Nứt nẻ.

Lá:

* Héo rũ.  
* Ngả vàng.

Thân:

* Gục xuống.

Rễ:

* Teo tóp.  
* Ngắn.  
* Không thể hút nước hiệu quả.

## **Kết quả**

**Cây héo khô và chết.**

---

# **25\. KẾT QUẢ CHẬU B – TRƯỜNG HỢP THIẾU ÁNH SÁNG**

## **Điều kiện**

* Có nước.  
* Có chất khoáng.  
* Có không khí.  
* Nhiệt độ thích hợp.  
* Bị thùng đen che sáng.

## **Sau 14 ngày**

Môi trường:

* Bên trong thùng rất tối.

Thân:

* Dài bất thường.  
* Cây cao nhưng yếu.

Lá:

* Vàng nhạt hoặc trắng bệch.

Rễ:

* Phát triển yếu.  
* Bám đất kém.

## **Kết quả**

**Cây yếu ớt, héo dần.**

---

# **26\. KẾT QUẢ CHẬU B – TRƯỜNG HỢP THIẾU KHÔNG KHÍ**

## **Điều kiện**

* Có nước.  
* Có chất khoáng.  
* Có ánh sáng.  
* Nhiệt độ thích hợp.  
* Thùng trong suốt được dán kín, hạn chế trao đổi không khí.

## **Sau 14 ngày**

Thùng:

* Thành thùng có hơi nước ngưng tụ.

Cây:

* Lá rụng dần.  
* Thân có biểu hiện thối đen.

Đất:

* Ẩm/ướt.

Rễ:

* Thối đen.  
* Phát triển kém.

## **Kết quả**

**Cây bị thối và chết.**

---

# **27\. KẾT QUẢ CHẬU B – TRƯỜNG HỢP NHIỆT ĐỘ KHÔNG THÍCH HỢP**

Hệ thống sử dụng nhiệt độ cuối cùng mà học sinh đã thiết lập cho chậu B.

Kết quả được phân chia theo các khoảng nhiệt độ.

| Nhiệt độ | Kết quả sau 14 ngày | Biểu hiện |
| ----- | ----- | ----- |
| 0–27°C | Không sống được sau 14 ngày | Cây ngừng phát triển, thân rũ xuống; lá bị tổn thương do nhiệt độ quá thấp; đất có thể đóng băng và rễ bị ảnh hưởng |
| 28–31°C | Sống nhưng hoạt động không bình thường | Cây có biểu hiện sinh trưởng không tối ưu |
| 32–35°C | Sống khỏe | Cây sinh trưởng và phát triển bình thường |
| 36–39°C | Sống nhưng hoạt động không bình thường | Cây chịu tác động của nhiệt độ cao, sinh trưởng giảm |
| 40–60°C | Không sống được sau 7 ngày | Cây suy yếu nhanh và chết |

**Lưu ý nội dung:** Phần tài liệu gốc có các mô tả như “run nhẹ, co cụm, xù lông, há mỏ, xòe cánh, tìm nơi mát...”, đây là các biểu hiện được viết theo hướng mô tả động vật. Khi triển khai website về **cây đậu xanh**, các biểu hiện này cần được thay bằng biểu hiện sinh học phù hợp với thực vật.

---

# **28\. HỆ THỐNG TRẠNG THÁI CỦA CHẬU B**

Mỗi khi học sinh thiết lập một điều kiện, hệ thống cần cập nhật trạng thái tương ứng của chậu B.

Các trạng thái chính:

### **Nước**

* Có nước.  
* Thiếu nước.

### **Chất khoáng**

* Có chất khoáng.  
* Thiếu chất khoáng.

### **Không khí**

* Có không khí.  
* Thiếu không khí.

### **Ánh sáng**

* Có ánh sáng.  
* Thiếu ánh sáng.

### **Nhiệt độ**

* 0–27°C.  
* 28–31°C.  
* 32–35°C.  
* 36–39°C.  
* 40–60°C.

Các trạng thái này được lưu lại cho đến khi:

* Học sinh nhấn “BẮT ĐẦU THÍ NGHIỆM”, hoặc  
* Học sinh nhấn “LÀM LẠI THÍ NGHIỆM”.

---

# **29\. LOGIC ƯU TIÊN KẾT QUẢ**

Sau khi học sinh nhấn “BẮT ĐẦU THÍ NGHIỆM”, hệ thống xác định kết quả dựa trên điều kiện của chậu B.

Các trường hợp chính cần mô phỏng:

### **Trường hợp A – Đủ điều kiện**

Có:

* Nước.  
* Chất khoáng.  
* Không khí.  
* Ánh sáng.  
* Nhiệt độ thích hợp.

→ Cây phát triển khỏe mạnh.

### **Trường hợp B – Thiếu chất khoáng**

→ Cây sống còi cọc, suy yếu.

### **Trường hợp C – Thiếu nước**

→ Cây héo khô và chết.

### **Trường hợp D – Thiếu ánh sáng**

→ Cây yếu ớt, héo dần.

### **Trường hợp E – Thiếu không khí**

→ Cây bị thối và chết.

### **Trường hợp F – Nhiệt độ không thích hợp**

→ Kết quả phụ thuộc khoảng nhiệt độ được thiết lập.

---

# **30\. TRẠNG THÁI KHÓA SAU KHI BẮT ĐẦU**

Ngay khi học sinh nhấn:

**BẮT ĐẦU THÍ NGHIỆM**

toàn bộ dụng cụ thiết lập phải bị khóa.

Học sinh không thể:

* Tưới thêm nước.  
* Thay đất.  
* Bón thêm phân.  
* Tháo thùng che sáng.  
* Tháo thùng kín.  
* Thay đổi nhiệt độ.

Mục đích là đảm bảo kết quả quan sát phản ánh đúng điều kiện mà học sinh đã thiết lập trước khi bắt đầu.

Nút **LÀM LẠI THÍ NGHIỆM** vẫn hoạt động bình thường.

---

# **31\. HIỆU ỨNG HÌNH ẢNH**

Website nên sử dụng các hiệu ứng trực quan để học sinh dễ nhận biết sự thay đổi.

### **Khi có nước**

* Đất chuyển từ khô sang ẩm.  
* Có hiệu ứng nước khi tưới.

### **Khi thiếu nước**

* Đất khô dần.  
* Xuất hiện vết nứt.  
* Lá rũ xuống.  
* Cây chuyển sang trạng thái héo.

### **Khi thiếu chất khoáng**

* Đất có nhiều sỏi.  
* Cây phát triển chậm.  
* Lá nhỏ và nhạt màu.

### **Khi thiếu ánh sáng**

* Không gian trong thùng tối.  
* Thân cây vươn dài.  
* Lá nhạt màu.

### **Khi thiếu không khí**

* Thành thùng có hơi nước.  
* Đất ẩm.  
* Rễ và thân chuyển sang trạng thái suy yếu/thối.

### **Khi nhiệt độ quá thấp**

* Có thể thể hiện môi trường lạnh.  
* Cây ngừng phát triển.  
* Các bộ phận của cây bị tổn thương.

### **Khi nhiệt độ quá cao**

* Môi trường nóng.  
* Cây suy yếu.  
* Lá có dấu hiệu héo.  
* Sinh trưởng giảm dần.

---

# **32\. MÀN HÌNH KẾT QUẢ**

Sau khi tua nhanh đến:

**14 NGÀY SAU**

màn hình hiển thị đồng thời:

## **CHẬU A – ĐỐI CHỨNG**

Cây phát triển khỏe mạnh.

## **CHẬU B – THÍ NGHIỆM**

Cây thể hiện kết quả tương ứng với điều kiện mà học sinh đã lựa chọn.

Bên cạnh hai chậu có thể hiển thị bảng so sánh:

| Yếu tố | Chậu A | Chậu B |
| ----- | ----- | ----- |
| Nước | Có | Theo thiết lập |
| Chất khoáng | Có | Theo thiết lập |
| Không khí | Có | Theo thiết lập |
| Ánh sáng | Có | Theo thiết lập |
| Nhiệt độ | Thích hợp | Theo thiết lập |
| Kết quả | Phát triển khỏe mạnh | Phụ thuộc điều kiện |

---

# **33\. THÔNG BÁO TƯƠNG TÁC**

Các thông báo cần ngắn, rõ ràng và phù hợp với học sinh tiểu học.

Danh sách thông báo:

**Đặt cây sai thứ tự:**

“Hãy đặt chậu cây lên bàn trước.”

**Tưới nước sai vị trí:**

“Hãy đưa bình tưới đến chậu cây.”

**Đặt đất sỏi sai vị trí:**

“Hãy đặt chậu đất sỏi vào vị trí của chậu B.”

**Đặt thùng đen sai vị trí:**

“Hãy úp thùng đen kín chậu cây.”

**Đặt thùng trong suốt sai vị trí:**

“Hãy úp thùng trong suốt kín chậu cây.”

**Xác nhận làm lại:**

“Em có chắc muốn làm lại thí nghiệm không?”

---

# **34\. NGUYÊN TẮC UX/UI**

Giao diện cần ưu tiên trải nghiệm học sinh tiểu học.

### **Kích thước**

Các nút điều khiển phải đủ lớn.

### **Kéo – thả**

Các vật dụng cần có:

* Vùng kéo rõ ràng.  
* Vùng thả rõ ràng.  
* Hiệu ứng khi được chọn.  
* Hiệu ứng khi kéo.  
* Phản hồi khi thả đúng.  
* Phản hồi khi thả sai.

### **Phản hồi**

Mỗi thao tác của học sinh cần tạo phản hồi trực quan.

Ví dụ:

* Thả đúng → dụng cụ ở lại vị trí.  
* Thả sai → dụng cụ quay lại.  
* Thao tác bị khóa → hiển thị trạng thái khóa.  
* Thiết lập thành công → hiển thị dấu ✓.

---

# **35\. TRẠNG THÁI BAN ĐẦU CỦA WEBSITE**

Khi học sinh mới mở thí nghiệm:

### **Bàn thí nghiệm**

Trống.

### **Khay dụng cụ**

Hiển thị đầy đủ:

* Chậu A.  
* Chậu B.  
* Bình tưới.  
* Chậu đất sỏi.  
* Phân NPK.  
* Thùng đen.  
* Thùng trong suốt.

### **Nhiệt độ**

**28°C**

### **Thanh tiến trình**

Đang ở:

**Đặt cây**

### **Chậu A**

Chưa đặt lên bàn nhưng đã được hệ thống xác định là mẫu đối chứng.

### **Chậu B**

Đang ở trạng thái ban đầu.

### **Kết quả**

Chưa có.

### **Nút**

**BẮT ĐẦU THÍ NGHIỆM** chưa cho phép thực hiện cho đến khi hai chậu đã được đặt đúng vị trí.

---

# **36\. TRẠNG THÁI HOÀN THÀNH**

Sau khi hoàn thành quá trình quan sát:

* Hiển thị dòng chữ lớn: **14 NGÀY SAU**.  
* Hai cây được hiển thị rõ ràng.  
* Chậu A thể hiện quá trình phát triển bình thường.  
* Chậu B thể hiện kết quả tương ứng với điều kiện thí nghiệm.  
* Hiển thị thông tin các yếu tố đã thiết lập.  
* Cho phép học sinh quan sát và so sánh.  
* Nút **LÀM LẠI THÍ NGHIỆM** vẫn luôn hiển thị.

---

# **37\. MỤC TIÊU TRẢI NGHIỆM HỌC TẬP**

Thông qua mô phỏng, học sinh có thể quan sát sự khác biệt giữa:

**Chậu đối chứng**

và

**Chậu thí nghiệm**

từ đó nhận biết rằng cây cần các điều kiện môi trường thích hợp để sống và phát triển.

Các yếu tố được thể hiện trực quan:

**Nước \+ Chất khoáng \+ Không khí \+ Ánh sáng \+ Nhiệt độ thích hợp**

Chậu A giúp học sinh có một mẫu tham chiếu ổn định.

Chậu B cho phép học sinh chủ động thay đổi điều kiện và quan sát kết quả.

---

# **38\. LUỒNG HOẠT ĐỘNG HOÀN CHỈNH**

### **Bước 1**

Học sinh mở thí nghiệm.

### **Bước 2**

Hệ thống hiển thị bàn thí nghiệm và khay dụng cụ.

### **Bước 3**

Học sinh kéo chậu A lên bàn.

### **Bước 4**

Hệ thống xác nhận chậu A là:

**CHẬU A – ĐỐI CHỨNG**

### **Bước 5**

Học sinh kéo chậu B lên bàn.

### **Bước 6**

Hệ thống chuyển sang:

**THIẾT LẬP ĐIỀU KIỆN**

### **Bước 7**

Học sinh lựa chọn các dụng cụ để thay đổi điều kiện của chậu B.

### **Bước 8**

Hệ thống ghi nhận từng điều kiện:

* Nước.  
* Chất khoáng.  
* Không khí.  
* Ánh sáng.  
* Nhiệt độ.

### **Bước 9**

Học sinh nhấn:

**BẮT ĐẦU THÍ NGHIỆM**

### **Bước 10**

Hệ thống khóa các thao tác.

### **Bước 11**

Hệ thống bắt đầu tua nhanh:

**Ngày 1 → Ngày 3 → Ngày 7 → Ngày 14**

### **Bước 12**

Hiển thị:

**14 NGÀY SAU**

### **Bước 13**

Hiển thị kết quả của chậu A và chậu B.

### **Bước 14**

Học sinh quan sát và so sánh.

### **Bước 15**

Nếu muốn thực hiện lại:

Nhấn:

**LÀM LẠI THÍ NGHIỆM**

### **Bước 16**

Xác nhận:

**Em có chắc muốn làm lại thí nghiệm không?**

Chọn:

**HỦY** hoặc **LÀM LẠI**

Nếu chọn “LÀM LẠI”, toàn bộ thí nghiệm trở về trạng thái ban đầu.

---

# **39\. YÊU CẦU QUAN TRỌNG KHI LẬP TRÌNH**

Website cần đảm bảo:

1. Chậu A không thể bị thay đổi điều kiện.  
2. Mọi thay đổi môi trường chỉ áp dụng cho chậu B.  
3. Dụng cụ phải được kéo – thả.  
4. Thao tác sai phải có phản hồi.  
5. Dụng cụ thả sai phải quay lại vị trí ban đầu/gần nhất.  
6. Không được bắt đầu thí nghiệm khi chưa đặt đủ hai chậu.  
7. Sau khi bắt đầu, các thiết lập phải bị khóa.  
8. Nhiệt độ mặc định là 28°C.  
9. Nhiệt độ chỉ áp dụng cho chậu B.  
10. Nhiệt độ cho phép từ 0°C đến 60°C.  
11. Kết quả được xác định dựa trên điều kiện đã thiết lập.  
12. Quá trình phát triển phải có hiệu ứng tua nhanh.  
13. Mốc kết quả chính là 14 ngày.  
14. Chậu A luôn đóng vai trò đối chứng.  
15. Nút “LÀM LẠI THÍ NGHIỆM” luôn hiển thị.  
16. Reset phải xóa toàn bộ trạng thái tương tác trước đó.  
17. Sau reset, nhiệt độ trở về 28°C.  
18. Sau reset, toàn bộ dụng cụ trở về khay.  
19. Sau reset, bàn thí nghiệm trở về trạng thái trống.  
20. Sau reset, thanh tiến trình trở về bước đầu tiên.

---

# **40\. CẤU TRÚC NỘI DUNG HIỂN THỊ TRÊN WEBSITE**

Có thể tổ chức website thành các khu vực:

**HEADER**

Tên thí nghiệm:

**THÍ NGHIỆM 1: TÌM HIỂU CÁC YẾU TỐ CẦN THIẾT CHO SỰ SỐNG VÀ PHÁT TRIỂN CỦA THỰC VẬT**

**PROGRESS BAR**

Đặt cây → Thiết lập điều kiện → Bắt đầu thí nghiệm → Quan sát kết quả

**SIDEBAR TRÁI**

Khay dụng cụ.

**CENTER**

Bàn thí nghiệm \+ hai chậu cây.

**SIDEBAR/CONTROL PANEL**

Điều khiển nhiệt độ.

**MODAL**

Thông tin chậu cây.

**RESULT PANEL**

Kết quả sau 14 ngày.

**RESET BUTTON**

LÀM LẠI THÍ NGHIỆM

---

# **41\. CÁC TRẠNG THÁI CẦN CÓ TRONG HỆ THỐNG**

Hệ thống nên quản lý tối thiểu các trạng thái:

* initial  
* plantPlacement  
* conditionSetup  
* experimentRunning  
* observation  
* completed  
* resetConfirmation

Đối với chậu B, cần lưu:

* water  
* minerals  
* air  
* light  
* temperature

Trong đó:

water \= true/false

minerals \= true/false

air \= true/false

light \= true/false

temperature \= 0–60

Kết quả cuối cùng được xác định từ tổ hợp các trạng thái trên.

---

# **42\. KẾT LUẬN NỘI DUNG**

Đây là một mô phỏng thí nghiệm tương tác trong đó học sinh trực tiếp thay đổi các điều kiện sống của cây đậu xanh.

Cấu trúc cốt lõi của trải nghiệm là:

**QUAN SÁT → THAO TÁC → THAY ĐỔI ĐIỀU KIỆN → BẮT ĐẦU → TUA NHANH THỜI GIAN → QUAN SÁT KẾT QUẢ → SO SÁNH**

Hai chậu cây đóng vai trò khác nhau:

**Chậu A:** mẫu đối chứng, luôn có điều kiện thích hợp.

**Chậu B:** mẫu thí nghiệm, cho phép học sinh thay đổi điều kiện.

Qua kết quả sau 14 ngày, học sinh có thể trực quan nhận thấy sự khác biệt về sự phát triển của cây khi một hoặc nhiều điều kiện môi trường bị thay đổi.

# THÍ NGHIỆM 2

# **THÍ NGHIỆM 2**

## **TÌM HIỂU SỰ TRAO ĐỔI KHÍ, NƯỚC VÀ CHẤT KHOÁNG CỦA THỰC VẬT VỚI MÔI TRƯỜNG**

### **Đối tượng thí nghiệm: Cây rau cải**

---

# **1\. MỤC ĐÍCH CỦA THÍ NGHIỆM**

Website mô phỏng một thí nghiệm tương tác dành cho học sinh tiểu học, giúp học sinh trực tiếp quan sát và tìm hiểu cách cây rau cải trao đổi các chất với môi trường xung quanh.

Thông qua các thao tác kéo – thả, phóng to và quan sát, học sinh tìm hiểu ba nội dung chính:

### **1.1. Trao đổi khí**

Học sinh tìm hiểu hai quá trình:

* **Hô hấp:** cây lấy khí ôxi (O₂) từ môi trường và thải khí cacbonic (CO₂) ra môi trường.  
* **Quang hợp:** cây lấy khí cacbonic (CO₂) từ môi trường, sử dụng ánh sáng và nước để tạo chất dinh dưỡng, đồng thời thải khí ôxi (O₂) ra môi trường.

### **1.2. Trao đổi nước**

Học sinh quan sát:

* Nước có trong đất.  
* Rễ hấp thụ nước.  
* Nước được vận chuyển từ rễ lên thân.  
* Nước tiếp tục được vận chuyển đến lá và các bộ phận khác của cây.

### **1.3. Trao đổi chất khoáng**

Học sinh quan sát:

* Chất khoáng có trong đất.  
* Rễ hấp thụ chất khoáng.  
* Chất khoáng được vận chuyển từ rễ lên thân và đến các bộ phận của cây.

---

# **2\. BỐ CỤC TỔNG THỂ WEBSITE**

Giao diện được chia thành 3 khu vực chính:

## **KHU VỰC 1 – KHAY DỤNG CỤ**

Đặt cố định ở bên trái màn hình.

Khay gồm:

1. Chậu cây rau cải 3D.  
2. Bình tưới nước.  
3. Túi/khay đất có chất khoáng.  
4. Kính phóng đại 3D.  
5. Hộp trong suốt dùng để quan sát sự trao đổi khí.

Tất cả vật dụng được thiết kế theo phong cách:

* 3D chân thật.  
* Tỉ lệ hợp lý.  
* Màu sắc rõ ràng.  
* Dễ nhận biết.  
* Phù hợp với học sinh tiểu học.

---

# **3\. KHU VỰC TRUNG TÂM – BÀN QUAN SÁT**

Ở trung tâm màn hình là:

**BÀN QUAN SÁT BẰNG GỖ**

Trên bàn có thể đặt:

* Chậu rau cải.  
* Bình tưới nước.  
* Đất/chất khoáng.  
* Kính phóng đại.  
* Hộp trong suốt.  
* Các đối tượng phục vụ từng nội dung quan sát.

Bàn là khu vực thao tác chính của học sinh.

---

# **4\. KHU VỰC ĐIỀU KHIỂN NỘI DUNG**

Phía trên bàn quan sát hiển thị hai nút lớn:

> **TRAO ĐỔI KHÍ**

> **TRAO ĐỔI NƯỚC VÀ CHẤT KHOÁNG**

Hai nút này đại diện cho hai nội dung chính của thí nghiệm.

---

# **5\. THANH TIẾN TRÌNH**

Bên dưới hai nút nội dung là thanh tiến trình:

**CÂY RAU CẢI → TRAO ĐỔI KHÍ → TRAO ĐỔI NƯỚC VÀ CHẤT KHOÁNG → HOÀN THÀNH**

Mỗi giai đoạn có trạng thái:

* Chưa mở.  
* Đang thực hiện.  
* Đã hoàn thành ✓.

Do hai nội dung chính có thể thực hiện theo bất kỳ thứ tự nào nên thanh tiến trình cần hỗ trợ trạng thái song song.

Ví dụ:

**CÂY RAU CẢI ✓ → TRAO ĐỔI KHÍ ✓ → TRAO ĐỔI NƯỚC VÀ CHẤT KHOÁNG đang thực hiện → HOÀN THÀNH**

hoặc:

**CÂY RAU CẢI ✓ → TRAO ĐỔI KHÍ đang thực hiện → TRAO ĐỔI NƯỚC VÀ CHẤT KHOÁNG ✓ → HOÀN THÀNH**

---

# **6\. TRẠNG THÁI BAN ĐẦU**

Khi học sinh mới mở thí nghiệm:

### **Khay dụng cụ**

Hiển thị đầy đủ:

* Chậu rau cải.  
* Bình tưới nước.  
* Đất/chất khoáng.  
* Kính phóng đại.  
* Hộp trong suốt.

### **Bàn quan sát**

Bàn đang trống.

### **Hai nút nội dung**

Hiển thị nhưng ở trạng thái **khóa**.

* TRAO ĐỔI KHÍ – 🔒  
* TRAO ĐỔI NƯỚC VÀ CHẤT KHOÁNG – 🔒

### **Thanh tiến trình**

Đang ở trạng thái:

**CÂY RAU CẢI**

Hệ thống yêu cầu học sinh đặt cây lên bàn trước.

---

# **7\. THAO TÁC CHUẨN BỊ – ĐẶT CÂY**

Học sinh kéo:

**CHẬU CÂY RAU CẢI**

từ khay dụng cụ bên trái lên bàn quan sát.

## **7.1. Kéo đúng**

Nếu học sinh thả chậu cây trong vùng bàn quan sát:

* Chậu cây được đặt cố định.  
* Xuất hiện vòng sáng nhẹ.  
* Cây có hiệu ứng nổi bật trong thời gian ngắn.  
* Hai nút nội dung được mở khóa.

Hiển thị:

> **“Đã đặt cây rau cải. Hãy chọn nội dung em muốn quan sát.”**

Hai nút chuyển sang trạng thái:

**TRAO ĐỔI KHÍ**

**TRAO ĐỔI NƯỚC VÀ CHẤT KHOÁNG**

---

# **8\. KÉO CÂY SAI VỊ TRÍ**

Nếu học sinh kéo chậu cây nhưng thả bên ngoài khu vực bàn:

Hiển thị:

> **“Hãy đặt cây rau cải lên bàn quan sát.”**

Sau đó:

* Chậu cây tự động trở lại khay.  
* Hai nội dung tiếp tục bị khóa.

---

# **9\. QUY TẮC QUAN TRỌNG**

Khi chưa đặt cây:

**TRAO ĐỔI KHÍ \= KHÓA**

**TRAO ĐỔI NƯỚC VÀ CHẤT KHOÁNG \= KHÓA**

Chỉ khi cây được đặt đúng trên bàn:

**TRAO ĐỔI KHÍ \= MỞ**

**TRAO ĐỔI NƯỚC VÀ CHẤT KHOÁNG \= MỞ**

---

# **10\. QUAN SÁT CẤU TẠO CÂY**

Sau khi cây được đặt lên bàn, học sinh có thể nhấp vào các bộ phận của cây để tìm hiểu.

Có 3 vùng tương tác chính:

1. Lá.  
2. Thân.  
3. Đất/rễ.

---

# **11\. NHẤP VÀO LÁ**

Khi học sinh nhấp vào lá:

* Lá được viền sáng.  
* Camera có thể phóng nhẹ vào khu vực lá.  
* Hiển thị nhãn:

**LÁ CÂY**

Nội dung:

> **“Lá là cơ quan quan trọng giúp cây trao đổi khí với môi trường và thực hiện quang hợp.”**

---

# **12\. NHẤP VÀO THÂN**

Khi học sinh nhấp vào thân:

* Thân được viền sáng.  
* Hiển thị nhãn:

**THÂN CÂY**

Thông báo:

> **“Thân giúp nâng đỡ cây và vận chuyển nước, chất khoáng đến các bộ phận của cây.”**

---

# **13\. NHẤP VÀO ĐẤT/RỄ**

Khi học sinh nhấp vào khu vực đất:

Camera chuyển sang chế độ:

**MẶT CẮT ĐẤT**

Phần đất được hiển thị dạng mặt cắt.

Bộ rễ được hiển thị rõ bên trong đất.

Thông báo:

> **“Rễ hấp thụ nước và chất khoáng từ đất.”**

---

# **14\. KÍNH PHÓNG ĐẠI 3D**

Học sinh có thể kéo kính phóng đại đến cây.

Kính có thể được sử dụng để quan sát:

* Lá.  
* Gân lá.  
* Rễ.  
* Các vùng tương tác quan trọng.

Khi kính được đặt đúng vị trí:

* Khu vực quan sát được phóng đại.  
* Xuất hiện vòng sáng.  
* Chi tiết cấu tạo được hiển thị rõ hơn.

---

# **15\. NỘI DUNG 1 – TRAO ĐỔI KHÍ**

Khi học sinh nhấp:

> **TRAO ĐỔI KHÍ**

màn hình chuyển sang chế độ:

**QUAN SÁT LÁ CÂY**

Camera phóng lớn phần lá.

Hai nội dung xuất hiện:

> **HÔ HẤP**

> **QUANG HỢP**

Học sinh có thể chọn một trong hai.

Không bắt buộc phải thực hiện HÔ HẤP trước.

---

# **16\. TRAO ĐỔI KHÍ – HÔ HẤP**

Khi học sinh chọn:

**HÔ HẤP**

màn hình chuyển sang chế độ quan sát lá trong điều kiện tối.

## **Hiệu ứng**

* Ánh sáng môi trường giảm.  
* Bầu trời chuyển sang tối.  
* Lá nổi bật trên nền tối.  
* Khu vực xung quanh lá xuất hiện các phân tử khí.

Hai loại khí được hiển thị:

**O₂ – KHÍ ÔXI**

**CO₂ – KHÍ CACBONIC**

---

# **17\. YÊU CẦU HÔ HẤP – TƯƠNG TÁC 1**

Hệ thống hiển thị:

> **“Hãy kéo khí mà cây lấy vào khi hô hấp vào lá cây.”**

Học sinh phải xác định khí cây lấy vào.

Đáp án:

**O₂**

---

# **18\. KÉO O₂ VÀO LÁ**

Học sinh kéo:

**O₂**

từ khu vực môi trường vào lá.

## **Nếu đúng**

* O₂ di chuyển về phía lá.  
* O₂ đi vào vùng lá.  
* Xuất hiện mũi tên:

**MÔI TRƯỜNG → O₂ → LÁ**

* Lá phát sáng nhẹ.

Hiển thị:

> **“Chính xác\! Khi hô hấp, cây lấy khí ôxi từ môi trường.”**

Sau đó hệ thống chuyển sang yêu cầu thứ hai.

---

# **19\. YÊU CẦU HÔ HẤP – TƯƠNG TÁC 2**

Hiển thị:

> **“Hãy kéo khí mà cây thải ra khi hô hấp ra môi trường.”**

Hai loại khí vẫn được hiển thị.

Học sinh phải kéo:

**CO₂**

từ lá ra môi trường.

---

# **20\. KÉO CO₂ RA MÔI TRƯỜNG**

Nếu đúng:

* CO₂ di chuyển từ lá ra ngoài.  
* Xuất hiện mũi tên:

**LÁ → CO₂ → MÔI TRƯỜNG**

Hiển thị:

> **“Chính xác\! Khi hô hấp, cây thải khí cacbonic ra môi trường.”**

Sau đó:

**ĐÃ HOÀN THÀNH QUAN SÁT HÔ HẤP ✓**

---

# **21\. XỬ LÝ KHI KÉO SAI – HÔ HẤP**

## **Trường hợp 1**

Học sinh kéo:

**CO₂ vào lá**

Hiển thị:

> **“Chưa đúng. Khi hô hấp, cây lấy khí ôxi từ môi trường.”**

CO₂ trở lại vị trí ban đầu.

## **Trường hợp 2**

Học sinh kéo:

**O₂ ra ngoài**

Hiển thị:

> **“Chưa đúng. Hãy xác định khí cây thải ra khi hô hấp.”**

O₂ trở lại vị trí ban đầu.

---

# **22\. SƠ ĐỒ HÔ HẤP**

Sau khi hoàn thành:

**O₂ → CÂY → CO₂**

Hệ thống có thể hiển thị sơ đồ lớn ở phía dưới:

**MÔI TRƯỜNG**

↓ O₂

**LÁ CÂY**

↓ CO₂

**MÔI TRƯỜNG**

Thông báo:

> **“Cây lấy khí ôxi từ môi trường để hô hấp và thải khí cacbonic ra môi trường.”**

---

# **23\. TRAO ĐỔI KHÍ – QUANG HỢP**

Học sinh chọn:

**QUANG HỢP**

Màn hình chuyển sang chế độ quan sát lá dưới ánh sáng.

## **Hiệu ứng**

* Trời sáng.  
* Ánh sáng chiếu xuống lá.  
* Lá có hiệu ứng phát sáng nhẹ.  
* Nước được thể hiện đang di chuyển từ rễ lên lá.  
* Các phân tử khí xuất hiện quanh lá.

Hiển thị:

**CO₂ – KHÍ CACBONIC**

**O₂ – KHÍ ÔXI**

---

# **24\. YÊU CẦU QUANG HỢP – TƯƠNG TÁC 1**

Hiển thị:

> **“Hãy kéo khí cây lấy vào khi quang hợp vào lá.”**

Đáp án:

**CO₂**

---

# **25\. KÉO CO₂ VÀO LÁ**

Học sinh kéo:

**CO₂**

từ môi trường vào lá.

## **Nếu đúng**

* CO₂ di chuyển vào lá.  
* Xuất hiện mũi tên:

**MÔI TRƯỜNG → CO₂ → LÁ**

Hiển thị:

> **“Chính xác\! Cây lấy khí cacbonic từ môi trường để quang hợp.”**

Sau đó hệ thống chuyển sang bước tiếp theo.

---

# **26\. YÊU CẦU QUANG HỢP – TƯƠNG TÁC 2**

Hiển thị:

> **“Cây thải khí gì ra môi trường khi quang hợp? Hãy kéo khí đó từ lá ra ngoài.”**

Đáp án:

**O₂**

---

# **27\. KÉO O₂ RA MÔI TRƯỜNG**

Học sinh kéo:

**O₂**

từ lá ra ngoài.

## **Nếu đúng**

* O₂ di chuyển từ lá ra môi trường.  
* Xuất hiện mũi tên:

**LÁ → O₂ → MÔI TRƯỜNG**

Hiển thị:

> **“Chính xác\! Cây thải khí ôxi ra môi trường khi quang hợp.”**

---

# **28\. HIỆU ỨNG QUANG HỢP**

Sau khi hoàn thành cả hai thao tác:

**CO₂ → LÁ → O₂**

hệ thống chạy hiệu ứng:

* Lá phát sáng nhẹ.  
* Lá chuyển sang trạng thái xanh tươi.  
* Ánh sáng chiếu xuống lá.  
* Các phân tử CO₂ đi vào lá.  
* Các phân tử O₂ đi ra môi trường.  
* Nước tiếp tục di chuyển từ rễ lên lá.

Hiển thị:

> **“Quang hợp đang diễn ra.”**

Sau đó hiển thị:

> **“Cây sử dụng ánh sáng, khí cacbonic và nước để tạo chất dinh dưỡng, đồng thời thải khí ôxi ra môi trường.”**

Tiếp theo:

**ĐÃ HOÀN THÀNH QUAN SÁT QUANG HỢP ✓**

---

# **29\. HOÀN THÀNH NỘI DUNG TRAO ĐỔI KHÍ**

Khi cả:

**HÔ HẤP ✓**

và

**QUANG HỢP ✓**

hệ thống đánh dấu:

> **TRAO ĐỔI KHÍ ✓**

Hiển thị thông báo:

> **“Em đã quan sát được hai quá trình trao đổi khí của cây: hô hấp và quang hợp.”**

Nếu nội dung còn lại chưa hoàn thành, hệ thống hiển thị:

> **“Hãy tiếp tục tìm hiểu sự trao đổi nước và chất khoáng của cây.”**

Nút:

**TRAO ĐỔI NƯỚC VÀ CHẤT KHOÁNG**

được làm nổi bật.

---

# **30\. NỘI DUNG 2 – TRAO ĐỔI NƯỚC VÀ CHẤT KHOÁNG**

Học sinh nhấp:

> **TRAO ĐỔI NƯỚC VÀ CHẤT KHOÁNG**

Màn hình chuyển sang:

**CHẾ ĐỘ QUAN SÁT BỘ RỄ**

Camera di chuyển xuống phần đất.

Đất được hiển thị dạng mặt cắt.

Bộ rễ được phóng lớn.

---

# **31\. SƠ ĐỒ VẬN CHUYỂN**

Hệ thống hiển thị:

**ĐẤT → RỄ → THÂN → LÁ**

Thông báo:

> **“Rễ cây hấp thụ nước và chất khoáng từ đất.”**

Hai nội dung tương tác xuất hiện:

**NƯỚC**

**CHẤT KHOÁNG**

Học sinh có thể thực hiện theo bất kỳ thứ tự nào.

---

# **32\. TƯƠNG TÁC NƯỚC**

Hệ thống hiển thị yêu cầu:

> **“Hãy tưới nước vào đất để quan sát cách cây hấp thụ và vận chuyển nước.”**

Học sinh kéo:

**BÌNH TƯỚI NƯỚC**

từ khay bên trái đến chậu cây.

---

# **33\. TƯỚI NƯỚC ĐÚNG**

Nếu học sinh tưới đúng vào đất:

* Nước chảy xuống đất.  
* Đất chuyển từ khô sang ẩm.  
* Các giọt nước di chuyển về phía rễ.  
* Rễ phát sáng nhẹ.  
* Các phân tử nước đi vào rễ.

Hiển thị:

> **“Đúng\! Rễ hấp thụ nước từ đất.”**

Sau đó xuất hiện mũi tên:

**RỄ → THÂN → LÁ**

Các phân tử nước di chuyển:

**ĐẤT → RỄ → THÂN → LÁ**

Thông báo:

> **“Nước được rễ hấp thụ và vận chuyển đến các bộ phận của cây.”**

Đánh dấu:

**NƯỚC ✓**

---

# **34\. TƯỚI NƯỚC SAI**

Nếu học sinh tưới ra ngoài chậu:

Hiển thị:

> **“Hãy tưới nước vào đất để cây có thể hấp thụ nước.”**

Bình tưới tự động trở lại vị trí gần nhất hoặc khay ban đầu.

Trạng thái:

**NƯỚC chưa hoàn thành**

---

# **35\. TƯƠNG TÁC CHẤT KHOÁNG**

Học sinh chọn:

**CHẤT KHOÁNG**

Hệ thống hiển thị các hạt chất khoáng nhỏ trong đất.

Hiển thị yêu cầu:

> **“Hãy đưa chất khoáng đến khu vực rễ cây.”**

Học sinh kéo:

**TÚI/KHAY ĐẤT CÓ CHẤT KHOÁNG**

đến khu vực rễ.

---

# **36\. ĐƯA CHẤT KHOÁNG ĐÚNG VỊ TRÍ**

Nếu học sinh thực hiện đúng:

* Các hạt chất khoáng xuất hiện rõ trong đất.  
* Các hạt di chuyển về phía rễ.  
* Rễ phát sáng nhẹ.  
* Chất khoáng đi vào rễ.  
* Các hạt tiếp tục di chuyển từ rễ lên thân.

Hiển thị:

> **“Chính xác\! Rễ hấp thụ chất khoáng từ đất.”**

Sau đó hiển thị:

**RỄ → THÂN → LÁ**

Đánh dấu:

**CHẤT KHOÁNG ✓**

---

# **37\. KÉO CHẤT KHOÁNG SAI**

Nếu học sinh kéo chất khoáng vào lá hoặc vị trí không phải vùng rễ:

Hiển thị:

> **“Chưa đúng. Chất khoáng được rễ hấp thụ từ đất.”**

Các hạt chất khoáng tự động trở lại vị trí ban đầu.

---

# **38\. HIỆU ỨNG TRAO ĐỔI NƯỚC VÀ CHẤT KHOÁNG**

Khi học sinh hoàn thành:

**NƯỚC ✓**

và

**CHẤT KHOÁNG ✓**

hệ thống chạy hiệu ứng tổng hợp.

Sơ đồ lớn:

**ĐẤT**

↓

**RỄ**

↓

**THÂN**

↓

**LÁ**

Trong đó:

* Phân tử nước có hiệu ứng chuyển động riêng.  
* Hạt chất khoáng có hiệu ứng chuyển động riêng.  
* Cả hai cùng di chuyển từ rễ lên thân và đến lá.

Cây chuyển sang trạng thái:

* Lá xanh.  
* Thân đứng vững.  
* Cây tươi tốt.  
* Hiệu ứng sinh trưởng nhẹ.

Hiển thị:

> **“Nước và chất khoáng được rễ hấp thụ từ đất và vận chuyển đến các bộ phận của cây.”**

Sau đó:

**HOÀN THÀNH TRAO ĐỔI NƯỚC VÀ CHẤT KHOÁNG ✓**

---

# **39\. HOÀN THÀNH TOÀN BỘ THÍ NGHIỆM**

Khi hai nội dung đều hoàn thành:

**TRAO ĐỔI KHÍ ✓**

**TRAO ĐỔI NƯỚC VÀ CHẤT KHOÁNG ✓**

thanh tiến trình chuyển sang:

**HOÀN THÀNH ✓**

Hệ thống hiển thị màn hình tổng kết.

---

# **40\. TƯƠNG TÁC TỔNG HỢP**

Sau khi hoàn thành hai nội dung, mở nút:

> **TƯƠNG TÁC TỔNG HỢP**

Nội dung này cho phép học sinh quan sát đồng thời các quá trình đã học.

Màn hình chuyển về chế độ xem toàn bộ cây.

Có thể nhìn thấy đồng thời:

### **Trao đổi khí**

**HÔ HẤP**

**MÔI TRƯỜNG → O₂ → CÂY → CO₂ → MÔI TRƯỜNG**

### **Quang hợp**

**MÔI TRƯỜNG → CO₂ → LÁ → O₂ → MÔI TRƯỜNG**

### **Trao đổi nước**

**ĐẤT → RỄ → THÂN → LÁ**

### **Trao đổi chất khoáng**

**ĐẤT → RỄ → THÂN → LÁ**

Các dòng chuyển động có thể chạy đồng thời để học sinh quan sát mối liên hệ giữa các quá trình.

---

# **41\. HIỆU ỨNG TỔNG HỢP**

Khi kích hoạt:

**TƯƠNG TÁC TỔNG HỢP**

hệ thống hiển thị:

* Ánh sáng chiếu xuống lá.  
* CO₂ di chuyển vào lá.  
* O₂ di chuyển ra môi trường.  
* O₂ được thể hiện đi vào cây trong quá trình hô hấp.  
* CO₂ được thể hiện đi ra môi trường trong quá trình hô hấp.  
* Nước di chuyển từ đất → rễ → thân → lá.  
* Chất khoáng di chuyển từ đất → rễ → thân → lá.

Cây rau cải có hiệu ứng sinh trưởng nhẹ.

---

# **42\. MÀN HÌNH KẾT LUẬN**

Sau khi hoàn thành toàn bộ thí nghiệm, hiển thị tiêu đề:

# **KẾT LUẬN**

Nội dung:

> **“Cây rau cải luôn trao đổi chất với môi trường. Trong hô hấp, cây lấy khí ôxi và thải khí cacbonic. Trong quang hợp, cây lấy khí cacbonic, sử dụng ánh sáng và nước để tạo chất dinh dưỡng, đồng thời thải khí ôxi. Rễ cây hấp thụ nước và chất khoáng từ đất, sau đó nước và chất khoáng được vận chuyển đến các bộ phận của cây.”**

---

# **43\. BẢNG TỔNG KẾT KIẾN THỨC**

Có thể hiển thị bảng:

| Quá trình | Cây lấy vào | Cây thải ra / vận chuyển |
| ----- | ----- | ----- |
| Hô hấp | Khí ôxi (O₂) | Khí cacbonic (CO₂) |
| Quang hợp | Khí cacbonic (CO₂), nước và ánh sáng | Khí ôxi (O₂) |
| Hấp thụ nước | Nước từ đất | Nước được vận chuyển đến các bộ phận |
| Hấp thụ chất khoáng | Chất khoáng từ đất | Chất khoáng được vận chuyển đến các bộ phận |

---

# **44\. LOGIC KHÓA/MỞ CHO LẬP TRÌNH**

## **STATE 0 – CHƯA ĐẶT CÂY**

Điều kiện:

plantPlaced \= false

Khóa:

* TRAO ĐỔI KHÍ.  
* TRAO ĐỔI NƯỚC VÀ CHẤT KHOÁNG.  
* HÔ HẤP.  
* QUANG HỢP.  
* NƯỚC.  
* CHẤT KHOÁNG.  
* TƯƠNG TÁC TỔNG HỢP.

Chỉ cho phép:

**Kéo cây rau cải lên bàn.**

---

# **45\. STATE 1 – ĐÃ ĐẶT CÂY**

Điều kiện:

plantPlaced \= true

Mở:

* TRAO ĐỔI KHÍ.  
* TRAO ĐỔI NƯỚC VÀ CHẤT KHOÁNG.

Học sinh được tự do chọn một trong hai.

---

# **46\. STATE 2 – TRAO ĐỔI KHÍ**

Khi chọn:

airExchange \= active

Mở:

* HÔ HẤP.  
* QUANG HỢP.

Học sinh có thể chọn bất kỳ nội dung nào trước.

---

# **47\. STATE 3 – HOÀN THÀNH HÔ HẤP**

Điều kiện:

respiration \= completed

Hiển thị:

**HÔ HẤP ✓**

Mở tiếp:

**QUANG HỢP**

nếu chưa hoàn thành.

---

# **48\. STATE 4 – HOÀN THÀNH QUANG HỢP**

Điều kiện:

photosynthesis \= completed

Hiển thị:

**QUANG HỢP ✓**

---

# **49\. STATE 5 – HOÀN THÀNH TRAO ĐỔI KHÍ**

Điều kiện:

respiration \= completed

và

photosynthesis \= completed

Khi đó:

airExchange \= completed

Hiển thị:

**TRAO ĐỔI KHÍ ✓**

---

# **50\. STATE 6 – TRAO ĐỔI NƯỚC VÀ CHẤT KHOÁNG**

Khi chọn:

waterMineralExchange \= active

Mở:

* NƯỚC.  
* CHẤT KHOÁNG.

Hai nội dung có thể thực hiện theo bất kỳ thứ tự nào.

---

# **51\. STATE 7 – HOÀN THÀNH NƯỚC**

Điều kiện:

water \= completed

Hiển thị:

**NƯỚC ✓**

---

# **52\. STATE 8 – HOÀN THÀNH CHẤT KHOÁNG**

Điều kiện:

minerals \= completed

Hiển thị:

**CHẤT KHOÁNG ✓**

---

# **53\. STATE 9 – HOÀN THÀNH TRAO ĐỔI NƯỚC VÀ CHẤT KHOÁNG**

Điều kiện:

water \= completed

và

minerals \= completed

Khi đó:

waterMineralExchange \= completed

Hiển thị:

**TRAO ĐỔI NƯỚC VÀ CHẤT KHOÁNG ✓**

---

# **54\. STATE 10 – HOÀN THÀNH TOÀN BỘ**

Điều kiện:

airExchange \= completed

và

waterMineralExchange \= completed

Khi đó:

experiment \= completed

Mở:

**TƯƠNG TÁC TỔNG HỢP**

và:

**HOÀN THÀNH ✓**

---

# **55\. LOGIC TỔNG QUÁT CHO DEVELOPER**

Có thể quản lý trạng thái theo cấu trúc:

plantPlaced  
    ↓  
airExchange  
    ├── respiration  
    │     ├── O2\_IN  
    │     └── CO2\_OUT  
    │  
    └── photosynthesis  
          ├── CO2\_IN  
          └── O2\_OUT

waterMineralExchange  
    ├── water  
    │     └── ROOT → STEM → LEAF  
    │  
    └── minerals  
          └── ROOT → STEM → LEAF

airExchange.completed  
        \+  
waterMineralExchange.completed  
        ↓  
experiment.completed  
        ↓  
TƯƠNG TÁC TỔNG HỢP

---

# **56\. CÁC BIẾN TRẠNG THÁI ĐỀ XUẤT**

Frontend có thể quản lý tối thiểu các biến:

plantPlaced  
selectedMainTopic

respirationCompleted  
respirationOxygenIn  
respirationCarbonDioxideOut

photosynthesisCompleted  
photosynthesisCarbonDioxideIn  
photosynthesisOxygenOut

waterCompleted  
mineralsCompleted

airExchangeCompleted  
waterMineralExchangeCompleted

experimentCompleted

---

# **57\. QUY TẮC KHI HỌC SINH THAO TÁC SAI**

Tất cả thao tác sai cần tuân theo cùng một nguyên tắc:

### **1\. Không làm thay đổi trạng thái đúng/sai**

### **2\. Đối tượng được kéo trở lại vị trí ban đầu**

### **3\. Hiển thị thông báo ngắn**

### **4\. Cho phép học sinh thử lại**

### **5\. Không phạt hoặc kết thúc thí nghiệm**

Mục đích là để học sinh **học thông qua thử và sai**.

---

# **58\. HỆ THỐNG PHẢN HỒI**

### **Phản hồi đúng**

Sử dụng:

* Vòng sáng.  
* Hiệu ứng phát sáng.  
* Mũi tên chuyển động.  
* Dấu ✓.  
* Thông báo “Chính xác\!” hoặc “Đúng\!”.

### **Phản hồi sai**

Sử dụng:

* Rung nhẹ đối tượng.  
* Đưa vật về vị trí cũ.  
* Thông báo ngắn.  
* Không sử dụng hiệu ứng gây cảm giác thất bại quá mạnh.

---

# **59\. ÂM THANH**

Có thể bổ sung âm thanh tùy chọn:

### **Khi kéo đúng**

Âm thanh xác nhận nhẹ.

### **Khi kéo sai**

Âm thanh cảnh báo nhẹ.

### **Khi hoàn thành nội dung**

Âm thanh hoàn thành.

### **Khi hoàn thành toàn bộ thí nghiệm**

Âm thanh chúc mừng nhẹ.

Âm thanh không nên quá lớn hoặc gây mất tập trung.

---

# **60\. NÚT LÀM LẠI THÍ NGHIỆM**

Nên có nút:

**LÀM LẠI THÍ NGHIỆM**

ở góc dưới bên phải.

Khi nhấn:

> **“Em có chắc muốn làm lại thí nghiệm không?”**

Hai nút:

**HỦY**

**LÀM LẠI**

Nếu chọn **HỦY**:

* Đóng hộp thoại.  
* Giữ nguyên trạng thái.

Nếu chọn **LÀM LẠI**:

* Xóa toàn bộ tiến trình.  
* Đưa cây về khay.  
* Đưa bình tưới về khay.  
* Đưa đất/chất khoáng về khay.  
* Đưa kính phóng đại về khay.  
* Đưa hộp trong suốt về khay.  
* Xóa tất cả hiệu ứng.  
* Xóa tất cả dấu ✓.  
* Đưa thanh tiến trình về:

**CÂY RAU CẢI**

* Khóa hai nội dung chính.  
* Đưa bàn quan sát về trạng thái ban đầu.

---

# **61\. TRẠNG THÁI HOÀN THÀNH CUỐI CÙNG**

Màn hình cuối cùng gồm:

### **Tiêu đề**

**THÍ NGHIỆM HOÀN THÀNH\!**

### **Cây rau cải**

Hiển thị cây ở trạng thái khỏe mạnh.

### **Các nội dung đã hoàn thành**

**TRAO ĐỔI KHÍ ✓**

**TRAO ĐỔI NƯỚC VÀ CHẤT KHOÁNG ✓**

### **Tương tác tổng hợp**

**XEM LẠI TƯƠNG TÁC TỔNG HỢP**

### **Kết luận**

Hiển thị nội dung kiến thức tổng kết.

### **Nút**

**LÀM LẠI THÍ NGHIỆM**

---

# **62\. LUỒNG TRẢI NGHIỆM HOÀN CHỈNH**

MỞ THÍ NGHIỆM  
       ↓  
ĐẶT CÂY RAU CẢI  
       ↓  
HAI NỘI DUNG ĐƯỢC MỞ  
       ↓  
 ┌───────────────┬────────────────────────┐  
 ↓               ↓  
TRAO ĐỔI KHÍ     TRAO ĐỔI NƯỚC & KHOÁNG  
 ↓               ↓  
HÔ HẤP           NƯỚC  
 ↓               ↓  
QUANG HỢP        CHẤT KHOÁNG  
 ↓               ↓  
✓                 ✓  
 └───────────────┴────────────────────────┘  
                  ↓  
           HAI NỘI DUNG ✓  
                  ↓  
        TƯƠNG TÁC TỔNG HỢP  
                  ↓  
             KẾT LUẬN  
                  ↓  
          HOÀN THÀNH THÍ NGHIỆM

---

# **63\. NGUYÊN TẮC THIẾT KẾ TRẢI NGHIỆM**

Website cần tạo cảm giác học sinh đang thực sự thực hiện một thí nghiệm.

Ưu tiên:

* Hình ảnh 3D.  
* Kéo – thả trực tiếp.  
* Camera chuyển cảnh.  
* Zoom vào lá và rễ.  
* Các phân tử O₂, CO₂ có chuyển động.  
* Nước có chuyển động.  
* Chất khoáng có chuyển động.  
* Mũi tên chỉ rõ hướng di chuyển.  
* Phản hồi tức thời.

Không nên để học sinh chỉ đọc văn bản.

Mỗi kiến thức cần được thể hiện bằng:

**THAO TÁC → QUAN SÁT → PHẢN HỒI → KẾT LUẬN**

---

# **64\. CẤU TRÚC COMPONENT UI ĐỀ XUẤT**

Có thể chia giao diện thành các component:

ExperimentPage  
│  
├── Header  
│  
├── ProgressBar  
│  
├── ToolTray  
│   ├── VegetablePot  
│   ├── WateringCan  
│   ├── MineralSoil  
│   ├── MagnifyingGlass  
│   └── TransparentBox  
│  
├── ObservationTable  
│   └── VegetablePlant  
│       ├── Leaf  
│       ├── Stem  
│       ├── Soil  
│       └── Root  
│  
├── MainTopicSelector  
│   ├── AirExchangeButton  
│   └── WaterMineralButton  
│  
├── AirExchangePanel  
│   ├── Respiration  
│   └── Photosynthesis  
│  
├── WaterMineralPanel  
│   ├── Water  
│   └── Minerals  
│  
├── Magnifier  
│  
├── FeedbackMessage  
│  
├── SummaryPanel  
│  
├── ConclusionPanel  
│  
└── ResetButton

---

# **65\. NGUYÊN TẮC CUỐI CÙNG CHO WEBSITE**

Toàn bộ thí nghiệm phải đảm bảo 5 nguyên tắc:

### **1\. HỌC SINH ĐƯỢC CHỦ ĐỘNG**

Hai nội dung chính có thể thực hiện theo bất kỳ thứ tự nào.

### **2\. THAO TÁC TRỰC QUAN**

Các kiến thức được thể hiện bằng kéo – thả và chuyển động.

### **3\. KHÔNG KHÓA SAI LOGIC**

Chỉ khóa nội dung khi chưa đáp ứng điều kiện cần thiết.

### **4\. HỌC SINH CÓ THỂ THỬ LẠI**

Thao tác sai không làm mất tiến trình.

### **5\. LUÔN CÓ KẾT LUẬN**

Sau khi hoàn thành, hệ thống phải giúp học sinh hiểu được:

**Cây trao đổi khí với môi trường.**

**Cây hấp thụ nước và chất khoáng từ đất.**

**Nước và chất khoáng được vận chuyển đến các bộ phận của cây.**

**Hô hấp và quang hợp là hai quá trình trao đổi khí quan trọng của cây.**

**Cây sử dụng ánh sáng, nước và khí cacbonic trong quá trình quang hợp và thải khí ôxi ra môi trường.**

# THÍ NGHIỆM 3

# **ĐẶC TẢ WEB THÍ NGHIỆM TƯƠNG TÁC**

## **TÌM HIỂU 5 YẾU TỐ CẦN THIẾT CHO SỰ SỐNG CỦA ĐỘNG VẬT**

### **Đối tượng quan sát: CON GÀ**

---

# **1\. MỤC TIÊU CỦA THÍ NGHIỆM**

Xây dựng một website thí nghiệm khoa học tương tác dành cho học sinh tiểu học.

Học sinh không chỉ đọc kiến thức mà phải trực tiếp thực hiện các thao tác mô phỏng:

* Đặt chuồng.  
* Đặt gà vào đúng chuồng.  
* Thiết lập môi trường sống cho gà.  
* Thêm hoặc không thêm thức ăn.  
* Thêm hoặc không thêm nước.  
* Thêm hoặc không thêm ánh sáng.  
* Đóng hoặc không đóng nắp chuồng.  
* Điều chỉnh nhiệt độ.  
* Bắt đầu quá trình quan sát.  
* Quan sát sự thay đổi của gà sau 7 ngày.  
* So sánh gà trong điều kiện đầy đủ với gà trong điều kiện thiếu một hoặc nhiều yếu tố.

Năm yếu tố cần quan sát gồm:

1. **Thức ăn**  
2. **Nước**  
3. **Không khí/O₂**  
4. **Ánh sáng**  
5. **Nhiệt độ thích hợp**

Trọng tâm của website là giúp học sinh nhận ra rằng các điều kiện môi trường khác nhau sẽ ảnh hưởng đến sự sống, hoạt động và phát triển của gà.

Nguyên tắc trải nghiệm:

> **THAO TÁC → QUAN SÁT → PHẢN HỒI → KẾT QUẢ → RÚT RA KẾT LUẬN**

---

# **2\. BỐ CỤC TỔNG THỂ CỦA WEBSITE**

Giao diện chia thành 3 khu vực chính:

## **2.1. Khu vực bên trái – KHAY VẬT LIỆU**

Đây là khu vực cố định chứa các vật dụng mà học sinh có thể kéo – thả.

Khay gồm:

* Gà con A.  
* Gà con B.  
* Nắp chuồng.  
* Khay thức ăn.  
* Bát nước.  
* Đèn chiếu sáng.

Các vật dụng được thiết kế theo phong cách:

* 3D.  
* Chân thật nhưng thân thiện với trẻ em.  
* Màu sắc rõ ràng.  
* Dễ nhận biết.  
* Kích thước đủ lớn để thao tác bằng chuột.  
* Có hiệu ứng hover khi đưa chuột vào.  
* Có hiệu ứng kéo khi học sinh bắt đầu drag.

Khi một vật dụng đang được kéo, vật dụng có thể:

* Phóng to nhẹ.  
* Có bóng đổ.  
* Có hiệu ứng nổi.  
* Hiển thị vùng có thể thả nếu cần.

Nếu thả sai, vật dụng không được nằm lại ở vị trí sai mà phải tự động quay về vị trí ban đầu.

---

# **3\. KHU VỰC TRUNG TÂM – BÀN THÍ NGHIỆM**

Ở trung tâm màn hình là:

> **BÀN THÍ NGHIỆM BẰNG GỖ**

Bàn đặt trong bối cảnh sân vườn.

## **3.1. Bối cảnh**

Bối cảnh gồm:

* Không gian ngoài trời.  
* Sân vườn.  
* Ánh sáng tự nhiên.  
* Không khí ngoài trời.  
* Một mặt bàn gỗ đủ rộng để đặt hai chuồng.

Không gian phải tạo cảm giác học sinh đang thực sự tiến hành một thí nghiệm ngoài trời.

---

# **4\. THANH TIẾN TRÌNH**

Phía trên màn hình hiển thị thanh tiến trình:

> **CHUẨN BỊ → THIẾT LẬP MÔI TRƯỜNG → BẮT ĐẦU QUAN SÁT → KẾT QUẢ**

Thanh tiến trình phản ánh trạng thái hiện tại của thí nghiệm.

## **Trạng thái 1 – Chuẩn bị**

Học sinh cần:

* Đặt chuồng lên bàn.  
* Đặt gà vào đúng chuồng.

## **Trạng thái 2 – Thiết lập môi trường**

Học sinh được phép:

* Thêm thức ăn vào chuồng 2\.  
* Thêm nước vào chuồng 2\.  
* Thêm đèn vào chuồng 2\.  
* Đậy nắp chuồng 2\.  
* Điều chỉnh nhiệt độ chuồng 2\.

## **Trạng thái 3 – Bắt đầu quan sát**

Học sinh nhấn:

> **BẮT ĐẦU QUAN SÁT**

Hệ thống khóa các thao tác thiết lập môi trường và bắt đầu mô phỏng 7 ngày.

## **Trạng thái 4 – Kết quả**

Hệ thống hiển thị kết quả của:

* Chuồng 1\.  
* Chuồng 2\.

Đồng thời cho phép học sinh so sánh hai điều kiện.

---

# **5\. HAI CHUỒNG NUÔI**

Trên bàn có hai chuồng nuôi bằng nhựa/mica.

Hai chuồng được đánh số:

> **CHUỒNG 1**

và

> **CHUỒNG 2**

## **5.1. Đặc điểm chung**

Hai chuồng có hình dạng tương tự nhau.

Chuồng được thiết kế bằng vật liệu trong suốt để học sinh có thể nhìn thấy:

* Gà.  
* Thức ăn.  
* Nước.  
* Đèn.  
* Không gian bên trong.

Ban đầu:

> **CẢ HAI CHUỒNG ĐỀU KHÔNG CÓ NẮP.**

Mỗi chuồng có một bảng điều khiển nhiệt độ.

---

# **6\. BẢNG ĐIỀU KHIỂN NHIỆT ĐỘ**

Mỗi chuồng có bảng điện tử hiển thị nhiệt độ.

Ví dụ:

> **37°C**

Bảng có hai nút:

> **\[-\]**

và

> **\[+\]**

## **6.1. Chuồng 1**

Nhiệt độ chuồng 1:

> **Luôn cố định ở 37°C**

Học sinh không được thay đổi.

Nếu học sinh cố nhấn \[+\] hoặc \[-\]:

* Không thay đổi nhiệt độ.  
* Có thể hiển thị phản hồi ngắn:

> **Nhiệt độ chuồng 1 được giữ cố định ở 37°C.**

## **6.2. Chuồng 2**

Cho phép học sinh điều chỉnh:

> **0°C → 60°C**

Nhấn \[+\]:

> 37°C → 38°C → 39°C → ...

Nhấn \[-\]:

> 37°C → 36°C → 35°C → ...

Giới hạn:

* Thấp nhất: **0°C**  
* Cao nhất: **60°C**

Khi đạt giới hạn, nút tương ứng không tăng/giảm thêm.

---

# **7\. HAI CHÚ GÀ CON**

Có hai gà con:

> **GÀ CON A**

> **GÀ CON B**

Hai gà con được dựng 3D, kích thước tương đối giống nhau.

Ban đầu cả hai nằm trong khay vật liệu.

## **7.1. Thông tin gà con**

Khi học sinh nhấp vào gà A hoặc gà B, hiển thị bảng thông tin.

| Thông tin | Gà con A | Gà con B |
| ----- | ----- | ----- |
| Độ tuổi | 7 ngày tuổi | 7 ngày tuổi |
| Cân nặng | 65g | 65g |
| Giới tính | Đực | Đực |
| Màu lông | Vàng | Vàng |
| Giống loài | Gà Ri | Gà Ri |
| Tình trạng sức khỏe | Khỏe mạnh; phát triển đồng đều | Khỏe mạnh; phát triển đồng đều |

Bảng thông tin chỉ có mục đích cung cấp dữ liệu ban đầu.

Việc mở bảng thông tin:

* Không làm thay đổi trạng thái thí nghiệm.  
* Không làm thay đổi cân nặng.  
* Không làm thay đổi hành vi.  
* Không ảnh hưởng kết quả.

---

# **8\. NẮP CHUỒNG**

Có một nắp chuồng tương thích với hai chuồng.

Nắp được dùng để:

* Đậy kín chuồng.  
* Làm giảm/ngăn trao đổi khí với môi trường bên ngoài.  
* Tạo điều kiện thiếu O₂ trong chuồng 2\.

## **Quy tắc**

Nắp chỉ được sử dụng cho:

> **CHUỒNG 2**

Chuồng 1:

> **KHÔNG ĐƯỢC ĐẬY NẮP**

Nếu học sinh cố kéo nắp vào chuồng 1:

* Không cho nắp vào.  
* Nắp quay lại vị trí ban đầu.  
* Có thể hiển thị:

> **Nắp chỉ được sử dụng cho chuồng 2\.**

---

# **9\. KHAY THỨC ĂN**

Có khay chứa cám dành cho gà.

## **Chuồng 1**

Chuồng 1:

> **LUÔN CÓ SẴN THỨC ĂN**

Học sinh không được lấy khay thức ăn ra.

## **Chuồng 2**

Học sinh tự quyết định:

* Có đưa thức ăn vào.  
* Hoặc không đưa thức ăn vào.

Nếu đưa đúng:

* Khay được đặt trong chuồng.  
* Gà có thể tiến đến mổ cám.  
* Trạng thái:

> **CÓ THỨC ĂN**

Nếu không đưa vào:

> **THIẾU THỨC ĂN**

---

# **10\. BÁT NƯỚC**

Có một bát nước uống dành cho gà.

## **Chuồng 1**

Chuồng 1:

> **LUÔN CÓ SẴN NƯỚC**

Không cho phép học sinh lấy ra.

## **Chuồng 2**

Học sinh tự quyết định có đưa bát nước vào hay không.

Nếu đưa đúng:

* Bát được đặt vào chuồng.  
* Gà có thể uống nước.  
* Trạng thái:

> **CÓ NƯỚC**

Nếu không đưa:

> **THIẾU NƯỚC**

---

# **11\. ĐÈN CHIẾU SÁNG**

Có hai đèn chiếu sáng.

Đèn cung cấp ánh sáng cho gà.

## **Chuồng 1**

Đèn:

* Luôn được lắp sẵn.  
* Luôn bật.

Học sinh không được:

* Tháo đèn.  
* Tắt đèn.

## **Chuồng 2**

Học sinh tự quyết định có đưa đèn vào hay không.

Nếu kéo đúng:

* Đèn được lắp bên trong chuồng.  
* Đèn bật sáng.  
* Chuồng có ánh sáng.

Trạng thái:

> **CÓ ÁNH SÁNG**

Nếu không kéo đèn:

> **THIẾU ÁNH SÁNG**

---

# **12\. THAO TÁC CHUẨN BỊ**

## **BƯỚC 1 – ĐẶT HAI CHUỒNG LÊN BÀN**

Ban đầu bàn chưa có chuồng.

Hệ thống hiển thị hướng dẫn:

> **Hãy đặt hai chuồng nuôi lên bàn thí nghiệm.**

Hai chuồng được đặt đúng vị trí:

* Chuồng 1 bên trái.  
* Chuồng 2 bên phải.

Sau khi hai chuồng được đặt đúng:

> **Đã đặt đủ hai chuồng. Hãy đặt gà con vào đúng chuồng.**

Nếu chưa đặt đủ hai chuồng:

* Không mở bước đặt gà.

---

# **13\. BƯỚC 2 – ĐẶT GÀ VÀO CHUỒNG**

Học sinh kéo:

> **GÀ CON A → CHUỒNG 1**

và:

> **GÀ CON B → CHUỒNG 2**

## **Khi thả đúng**

Gà được đặt vào trong chuồng.

Hiển thị hiệu ứng:

* Gà đáp xuống nhẹ.  
* Chuồng sáng nhẹ.  
* Trạng thái hoàn thành bước.

Thông báo:

> **Đã đặt đúng hai gà con. Hãy thiết lập môi trường cho chuồng 2\.**

## **Khi thả sai**

Ví dụ:

* Gà A vào chuồng 2\.  
* Gà B vào chuồng 1\.  
* Gà bị thả ra ngoài.  
* Gà bị thả vào vị trí không hợp lệ.

Hệ thống:

1. Không cho gà đứng tại vị trí sai.  
2. Gà tự động quay về vị trí ban đầu.  
3. Hiển thị:

> **Hãy đặt gà con vào đúng chuồng.**

Học sinh được thử lại.

---

# **14\. THIẾT LẬP MÔI TRƯỜNG**

Sau khi hai gà được đặt đúng:

> **MỞ KHÓA GIAI ĐOẠN THIẾT LẬP MÔI TRƯỜNG**

Học sinh có thể thực hiện các thao tác theo thứ tự tùy ý.

Chuồng 1 và chuồng 2 có logic hoàn toàn khác nhau.

---

# **15\. CHUỒNG 1 – ĐIỀU KIỆN ĐỐI CHỨNG**

Chuồng 1 luôn có đầy đủ 5 yếu tố cần thiết.

## **15.1. Thức ăn**

Luôn có thức ăn.

Không được lấy ra.

## **15.2. Nước**

Luôn có nước.

Không được lấy ra.

## **15.3. Không khí/O₂**

Chuồng không có nắp.

Không được đậy nắp.

Chuồng luôn thông thoáng.

## **15.4. Ánh sáng**

Đèn được lắp sẵn.

Đèn luôn bật.

## **15.5. Nhiệt độ**

Luôn:

> **37°C**

Không cho phép thay đổi.

---

# **16\. QUY TẮC TƯƠNG TÁC VỚI CHUỒNG 1**

Học sinh không được:

* Thêm yếu tố mới.  
* Lấy thức ăn ra.  
* Lấy nước ra.  
* Tháo đèn.  
* Tắt đèn.  
* Đậy nắp.  
* Điều chỉnh nhiệt độ.

Mọi thao tác không hợp lệ:

> **Không làm thay đổi trạng thái chuồng 1\.**

Vật dụng phải quay lại vị trí ban đầu nếu thao tác kéo – thả không hợp lệ.

---

# **17\. CHUỒNG 2 – CHUỒNG THÍ NGHIỆM**

Chuồng 2 là nơi học sinh tự thiết lập môi trường.

Học sinh được tự do lựa chọn:

* Có thức ăn hay không.  
* Có nước hay không.  
* Có ánh sáng hay không.  
* Có O₂ hay không thông qua việc đậy nắp.  
* Nhiệt độ bao nhiêu.

Học sinh có thể tạo:

* Đủ 5 yếu tố.  
* Thiếu 1 yếu tố.  
* Thiếu 2 yếu tố.  
* Thiếu 3 yếu tố.  
* Thiếu 4 yếu tố.  
* Hoặc kết hợp nhiều điều kiện không thuận lợi.

Mục tiêu là để hệ thống tự động đọc **toàn bộ trạng thái cuối cùng** của chuồng 2\.

---

# **18\. TƯƠNG TÁC KÉO KHAY THỨC ĂN**

Học sinh kéo khay thức ăn từ khay vật liệu vào chuồng 2\.

## **Thả đúng**

Nếu vùng thả hợp lệ:

* Khay thức ăn đặt vào chuồng.  
* Gà có thể đi đến ăn.  
* Trạng thái food \= true.

## **Thả sai**

Thông báo:

> **Hãy đặt khay thức ăn vào chuồng 2\.**

Khay tự động quay về vị trí ban đầu.

---

# **19\. TƯƠNG TÁC KÉO BÁT NƯỚC**

Học sinh kéo bát nước vào chuồng 2\.

## **Thả đúng**

* Bát nước được đặt vào chuồng.  
* Gà có thể uống.  
* Trạng thái water \= true.

## **Thả sai**

Thông báo:

> **Hãy đặt bát nước vào chuồng 2\.**

Bát nước quay lại vị trí ban đầu.

---

# **20\. TƯƠNG TÁC KÉO ĐÈN**

Học sinh kéo đèn vào chuồng 2\.

## **Thả đúng**

* Đèn được lắp vào chuồng.  
* Đèn bật.  
* Không gian chuồng sáng lên.  
* Trạng thái light \= true.

## **Không kéo đèn**

Chuồng 2:

> **THIẾU ÁNH SÁNG**

## **Thả sai**

Thông báo:

> **Hãy đặt đèn vào chuồng 2\.**

Đèn quay lại vị trí ban đầu.

---

# **21\. TƯƠNG TÁC KÉO NẮP CHUỒNG**

Học sinh kéo nắp vào chuồng 2\.

## **Thả đúng**

Nắp khớp với chuồng.

Chuồng chuyển sang trạng thái:

> **KÍN**

Hệ thống xác định:

> **THIẾU O₂**

Hiệu ứng:

* Nắp khớp vào thân chuồng.  
* Thành kính có thể bắt đầu mờ nhẹ.  
* Xuất hiện hơi nước ngưng tụ.  
* Không khí bên trong được mô phỏng là bị hạn chế trao đổi với bên ngoài.

## **Thông báo**

> **Chuồng đã được đậy kín và trao đổi khí bị hạn chế.**

## **Thả sai**

Thông báo:

> **Hãy đặt nắp đúng vào chuồng 2\.**

Nắp quay lại vị trí ban đầu.

---

# **22\. ĐIỀU CHỈNH NHIỆT ĐỘ CHUỒNG 2**

Học sinh sử dụng:

> **\[-\]**

và

> **\[+\]**

để thay đổi nhiệt độ.

Giới hạn:

> **0°C – 60°C**

Hệ thống phải lưu chính xác nhiệt độ cuối cùng ngay trước khi học sinh nhấn:

> **BẮT ĐẦU QUAN SÁT**

Ví dụ:

> 37°C

hoặc:

> 25°C

hoặc:

> 42°C

---

# **23\. NÚT “BẮT ĐẦU QUAN SÁT”**

Nút chỉ được kích hoạt sau khi:

* Hai chuồng đã được đặt.  
* Gà A đã vào chuồng 1\.  
* Gà B đã vào chuồng 2\.

Khi học sinh nhấn:

> **BẮT ĐẦU QUAN SÁT**

hệ thống thực hiện ngay các thao tác sau:

1. Khóa toàn bộ kéo – thả.  
2. Khóa điều chỉnh nhiệt độ.  
3. Không cho thay đổi môi trường.  
4. Ghi nhận trạng thái cuối cùng của chuồng 2\.  
5. Giữ nguyên trạng thái đầy đủ của chuồng 1\.  
6. Bắt đầu mô phỏng thời gian 7 ngày.

Có thể hiển thị hộp xác nhận trước khi bắt đầu:

> **Em đã hoàn thành thiết lập môi trường. Bắt đầu quan sát trong 7 ngày?**

Nút:

> **BẮT ĐẦU**

> **HỦY**

---

# **24\. HIỆU ỨNG TUA NHANH 7 NGÀY**

Sau khi bắt đầu:

Màn hình hiển thị:

> **NGÀY 1**

sau đó:

> **NGÀY 2**

> **NGÀY 3**

> **NGÀY 4**

> **NGÀY 5**

> **NGÀY 6**

> **NGÀY 7**

Có thể sử dụng animation tua nhanh để tạo cảm giác thời gian đang trôi.

Trong quá trình này:

* Gà thay đổi hành vi.  
* Môi trường chuồng thay đổi.  
* Hoạt động của gà thay đổi tùy điều kiện.  
* Nếu có nhiều yếu tố thiếu, các hành vi được kết hợp.

---

# **25\. KẾT QUẢ CHUỒNG 1**

Chuồng 1 luôn có:

* Thức ăn.  
* Nước.  
* O₂.  
* Ánh sáng.  
* Nhiệt độ 37°C.

## **Hành vi**

Gà:

* Chạy nhảy.  
* Mổ cám.  
* Uống nước.  
* Đi lại.  
* Kêu “chiếp chiếp”.  
* Nghỉ/ngủ bình thường.

## **Sau 7 ngày**

Gà:

* Lớn nhanh.  
* Mọc thêm lông cánh.  
* Hoạt động bình thường.  
* Phát triển khỏe mạnh.

Cân nặng:

> **65g → 75g**

Kết quả này được dùng làm điều kiện đối chứng để so sánh với chuồng 2\.

---

# **26\. LOGIC KẾT QUẢ CHUỒNG 2**

Sau khi hết 7 ngày, hệ thống đọc toàn bộ trạng thái:

* food  
* water  
* oxygen  
* light  
* temperature

Không được chỉ kiểm tra một yếu tố.

Ví dụ:

Nếu:

* Có thức ăn.  
* Có nước.  
* Thiếu O₂.  
* Thiếu ánh sáng.  
* Nhiệt độ không thích hợp.

Hệ thống phải đồng thời kích hoạt:

* Hành vi thiếu O₂.  
* Hành vi thiếu ánh sáng.  
* Hành vi do nhiệt độ.  
* Đồng thời vẫn thể hiện gà có thức ăn và nước.

---

# **27\. THIẾU O₂**

Điều kiện:

> Chuồng 2 được đậy kín.

## **Hiệu ứng môi trường**

* Thành kính mờ.  
* Có hơi nước ngưng tụ.  
* Không gian trở nên bí hơn.

## **Hành vi gà**

Gà:

* Thở nhanh.  
* Há mỏ.  
* Vươn cổ.  
* Giảm hoạt động.  
* Dần suy yếu nếu tình trạng kéo dài.

Có thể sử dụng animation:

> bình thường → thở nhanh → giảm hoạt động → suy yếu

---

# **28\. THIẾU THỨC ĂN**

Điều kiện:

> Không có khay thức ăn trong chuồng 2\.

## **Hành vi**

Gà:

* Liên tục mổ xuống sàn tìm thức ăn.  
* Đi lại tìm kiếm.  
* Sau một thời gian giảm hoạt động.  
* Yếu dần.  
* Không phát triển bình thường nếu thiếu kéo dài.

---

# **29\. THIẾU NƯỚC**

Điều kiện:

> Không có bát nước trong chuồng 2\.

## **Hành vi**

Gà:

* Tìm kiếm nước.  
* Kêu nhiều.  
* Giảm hoạt động.  
* Trở nên lờ đờ.

Nếu thiếu nước kéo dài:

> Gà bị mất nước, suy yếu và ảnh hưởng đến sự sống.

---

# **30\. THIẾU ÁNH SÁNG**

Điều kiện:

> Không có đèn trong chuồng 2\.

## **Hiệu ứng môi trường**

* Chuồng tối hơn.  
* Có thể chuyển sang trạng thái ban đêm.  
* Ánh sáng tổng thể giảm.

## **Hành vi gà**

* Giảm hoạt động.  
* Ít đi lại.  
* Ít tìm kiếm thức ăn/nước hơn.  
* Sinh hoạt kém bình thường.

Thông điệp:

> **Ánh sáng là một yếu tố cần thiết cho hoạt động và sinh hoạt bình thường của gà.**

---

# **31\. NHIỆT ĐỘ KHÔNG THÍCH HỢP**

Hệ thống đọc nhiệt độ cuối cùng của chuồng 2\.

Có hai nhóm chính:

## **Nhiệt độ quá thấp**

Không gian có hiệu ứng lạnh.

Có thể:

* Chuyển tông màu môi trường sang xanh lạnh.  
* Xuất hiện hiệu ứng hơi lạnh.

Gà:

* Run.  
* Xù lông.  
* Co cụm.  
* Tìm nơi ấm.  
* Giảm hoạt động.

## **Nhiệt độ quá cao**

Không gian có hiệu ứng nóng.

Có thể:

* Chuyển tông màu sang cam/đỏ nhẹ.  
* Xuất hiện hiệu ứng hơi nóng.

Gà:

* Há mỏ.  
* Thở nhanh.  
* Xòe cánh.  
* Tìm vị trí mát.  
* Giảm hoạt động.

---

# **32\. BẢNG LOGIC NHIỆT ĐỘ**

Hệ thống sử dụng bảng sau để xác định kết quả sau 7 ngày:

| Nhiệt độ | Kết quả sau 7 ngày | Biểu hiện |
| ----- | ----- | ----- |
| 0–27°C | Không sống được sau 7 ngày | Run mạnh → co cụm → lờ đờ → suy yếu → chết |
| 28–31°C | Sống nhưng hoạt động không bình thường | Run nhẹ, co cụm, xù lông, hoạt động giảm |
| 32–35°C | Sống khỏe | Hoạt động, ăn uống, ngủ nghỉ và phát triển bình thường |
| 36–39°C | Sống nhưng hoạt động không bình thường | Há mỏ, thở nhanh, xòe cánh, tìm nơi mát, giảm hoạt động |
| 40–60°C | Không sống được sau 7 ngày | Thở gấp → lờ đờ → suy yếu → chết |

---

# **33\. LOGIC RIÊNG CỦA 5 YẾU TỐ**

Website phải xử lý độc lập từng yếu tố.

## **33.1. O₂**

Có O₂:

> Gà thở bình thường.

Thiếu O₂:

> Khó thở → yếu → có thể chết nếu thiếu kéo dài.

## **33.2. Nước**

Có nước:

> Gà uống nước bình thường.

Thiếu nước:

> Tìm nước → mất nước → yếu → có thể chết nếu kéo dài.

## **33.3. Thức ăn**

Có thức ăn:

> Gà ăn bình thường.

Thiếu thức ăn:

> Tìm thức ăn → yếu → suy kiệt nếu kéo dài.

## **33.4. Nhiệt độ**

Nhiệt độ thích hợp:

> Gà hoạt động và phát triển bình thường.

Kết quả được xác định theo bảng nhiệt độ.

## **33.5. Ánh sáng**

Có ánh sáng:

> Gà hoạt động bình thường.

Thiếu ánh sáng:

> Giảm hoạt động và ảnh hưởng đến sinh hoạt/phát triển.

---

# **34\. LOGIC KHI THIẾU NHIỀU YẾU TỐ**

Đây là phần rất quan trọng.

Website **không được chỉ lấy một nguyên nhân để quyết định kết quả**.

Hệ thống phải:

1. Đọc toàn bộ môi trường.  
2. Xác định yếu tố nào có.  
3. Xác định yếu tố nào thiếu.  
4. Xác định nhiệt độ.  
5. Tạo hành vi tương ứng cho từng yếu tố.  
6. Kết hợp các hành vi.  
7. Xác định kết quả cuối cùng.

---

# **35\. VÍ DỤ KẾT HỢP 3 YẾU TỐ BẤT LỢI**

Ví dụ học sinh thiết lập:

* Có nước.  
* Có thức ăn.  
* Thiếu O₂.  
* Thiếu ánh sáng.  
* Nhiệt độ không thích hợp.

Hệ thống kích hoạt đồng thời:

### **Thiếu O₂**

> Khó thở → suy yếu.

### **Thiếu ánh sáng**

> Giảm hoạt động.

### **Nhiệt độ không thích hợp**

> Suy yếu theo bảng nhiệt độ.

### **Có nước**

> Gà vẫn có nước.

### **Có thức ăn**

> Gà vẫn có thức ăn.

Kết quả tổng hợp phải phản ánh toàn bộ trạng thái.

Ví dụ:

> **Sau 7 ngày, gà suy yếu nghiêm trọng và không sống được do môi trường thiếu nhiều yếu tố cần thiết.**

Hệ thống có thể hiển thị từng nguyên nhân riêng biệt trong bảng phân tích.

---

# **36\. GIAO DIỆN KẾT QUẢ NÊN CÓ**

Sau 7 ngày, chuyển sang màn hình:

> **KẾT QUẢ THÍ NGHIỆM**

Chia màn hình thành hai khu vực:

## **CHUỒNG 1**

Hiển thị:

* Gà khỏe.  
* Ăn.  
* Uống.  
* Hoạt động.  
* Tăng trưởng.

Thông tin:

> **65g → 75g**

Trạng thái:

> **ĐỦ 5 YẾU TỐ**

## **CHUỒNG 2**

Hiển thị:

* Trạng thái gà.  
* Hành vi.  
* Cân nặng/trạng thái phát triển nếu được mô phỏng.  
* Các yếu tố đang có.  
* Các yếu tố bị thiếu.  
* Nhiệt độ.

---

# **37\. BẢNG SO SÁNH**

Hiển thị bảng:

| Yếu tố | Chuồng 1 | Chuồng 2 |
| ----- | ----- | ----- |
| Thức ăn | Có | Có/Không |
| Nước | Có | Có/Không |
| O₂ | Có | Có/Thiếu |
| Ánh sáng | Có | Có/Thiếu |
| Nhiệt độ | 37°C | Nhiệt độ HS chọn |
| Kết quả | Phát triển khỏe mạnh | Phụ thuộc điều kiện thiết lập |

Mỗi hàng có thể sử dụng biểu tượng:

* ✓ Có.  
* ✕ Thiếu.  
* Nhiệt độ hiển thị bằng số.

---

# **38\. PHÂN TÍCH KẾT QUẢ**

Sau bảng so sánh, hiển thị khu vực:

> **EM ĐÃ THIẾT LẬP CHUỒNG 2 NHƯ THẾ NÀO?**

Liệt kê:

### **Thức ăn**

> Có / Thiếu

### **Nước**

> Có / Thiếu

### **O₂**

> Có / Thiếu

### **Ánh sáng**

> Có / Thiếu

### **Nhiệt độ**

> XX°C

Sau đó hiển thị:

> **KẾT QUẢ SAU 7 NGÀY**

và mô tả hành vi tương ứng.

---

# **39\. KẾT LUẬN KIẾN THỨC**

Phần cuối màn hình hiển thị kết luận:

> **Để sống và phát triển, động vật cần thức ăn, nước, không khí, ánh sáng và nhiệt độ thích hợp. Khi một hoặc nhiều yếu tố cần thiết bị thiếu hoặc không phù hợp trong thời gian dài, hoạt động và sự phát triển của động vật sẽ bị ảnh hưởng, thậm chí có thể không sống được.**

Có thể làm nổi bật 5 từ khóa:

> **THỨC ĂN – NƯỚC – KHÔNG KHÍ – ÁNH SÁNG – NHIỆT ĐỘ THÍCH HỢP**

---

# **40\. QUY TẮC VẬT DỤNG KÉO SAI**

Đây là quy tắc chung áp dụng cho toàn bộ website.

Nếu vật dụng được kéo sai:

1. Không thay đổi trạng thái thí nghiệm.  
2. Không làm thay đổi dữ liệu.  
3. Không tính là hoàn thành thao tác.  
4. Vật dụng tự động quay về vị trí ban đầu.  
5. Hiển thị thông báo ngắn.  
6. Cho phép học sinh thử lại.

Ví dụ:

### **Gà sai**

> **Hãy đặt gà con vào đúng chuồng.**

### **Thức ăn sai**

> **Hãy đặt khay thức ăn vào chuồng 2\.**

### **Nước sai**

> **Hãy đặt bát nước vào chuồng 2\.**

### **Đèn sai**

> **Hãy đặt đèn vào chuồng 2\.**

### **Nắp sai**

> **Hãy đặt nắp đúng vào chuồng 2\.**

Không sử dụng cơ chế phạt.

Không trừ điểm.

Không khóa thí nghiệm vì thao tác sai.

---

# **41\. LOGIC KHÓA/MỞ TOÀN BỘ THÍ NGHIỆM**

## **STATE 0 – BAN ĐẦU**

Có:

* Khay vật liệu.  
* Gà A.  
* Gà B.  
* Nắp.  
* Thức ăn.  
* Nước.  
* Đèn.

Bàn chưa có chuồng.

Khóa:

* Thiết lập môi trường.  
* Bắt đầu quan sát.

---

## **STATE 1 – ĐÃ ĐẶT CHUỒNG**

Khi hai chuồng được đặt đúng:

> Mở thao tác đặt gà.

---

## **STATE 2 – ĐÃ ĐẶT ĐÚNG GÀ**

Khi:

> Gà A → Chuồng 1

và:

> Gà B → Chuồng 2

thì:

> Mở thiết lập môi trường.

---

## **STATE 3 – THIẾT LẬP MÔI TRƯỜNG**

Chuồng 1:

> Không thay đổi được.

Chuồng 2:

> Cho phép thiết lập tự do.

Cho phép:

* Thức ăn.  
* Nước.  
* Đèn.  
* Nắp.  
* Nhiệt độ.

---

## **STATE 4 – BẮT ĐẦU QUAN SÁT**

Khi nhấn:

> **BẮT ĐẦU QUAN SÁT**

thì:

* Khóa tất cả thao tác.  
* Lưu trạng thái chuồng 2\.  
* Bắt đầu tua nhanh 7 ngày.

---

## **STATE 5 – NGÀY 1 → NGÀY 7**

Hệ thống chạy animation.

Hành vi được xác định từ:

> food \+ water \+ oxygen \+ light \+ temperature

---

## **STATE 6 – KẾT QUẢ**

Sau ngày 7:

* Hiển thị chuồng 1\.  
* Hiển thị chuồng 2\.  
* So sánh.  
* Phân tích 5 yếu tố.  
* Hiển thị kết luận.

---

# **42\. CẤU TRÚC STATE ĐỀ XUẤT CHO LẬP TRÌNH**

Có thể tổ chức dữ liệu như sau:

experimentState

├── preparation  
│   ├── cage1Placed  
│   ├── cage2Placed  
│   ├── chickAPlaced  
│   └── chickBPlaced  
│  
├── cage1  
│   ├── food \= true  
│   ├── water \= true  
│   ├── oxygen \= true  
│   ├── light \= true  
│   └── temperature \= 37  
│  
├── cage2  
│   ├── food  
│   ├── water  
│   ├── oxygen  
│   ├── light  
│   └── temperature  
│  
├── observation  
│   ├── started  
│   ├── currentDay  
│   └── completed  
│  
└── result  
    ├── cage1Result  
    ├── cage2Result  
    ├── missingFactors  
    └── behaviorStates

---

# **43\. CÁC BIẾN QUAN TRỌNG**

Có thể sử dụng các biến:

cage1Placed  
cage2Placed

chickAPlaced  
chickBPlaced

cage2Food  
cage2Water  
cage2Oxygen  
cage2Light

cage2Temperature

observationStarted  
currentDay  
observationCompleted

cage2MissingFactors  
cage2Behavior  
cage2FinalResult

---

# **44\. LOGIC XÁC ĐỊNH O₂**

Chuồng 1:

oxygen \= true

Chuồng 2:

nắp mở  → oxygen \= true  
nắp kín → oxygen \= false

Khi nắp được đậy:

> oxygen \= false

Khi chưa bắt đầu quan sát, học sinh vẫn có thể mở nắp nếu thiết kế cho phép.

Sau khi nhấn:

> **BẮT ĐẦU QUAN SÁT**

trạng thái bị khóa.

---

# **45\. LOGIC XÁC ĐỊNH THỨC ĂN**

Chuồng 1:

food \= true

Chuồng 2:

có khay thức ăn → food \= true  
không có khay → food \= false

---

# **46\. LOGIC XÁC ĐỊNH NƯỚC**

Chuồng 1:

water \= true

Chuồng 2:

có bát nước → water \= true  
không có bát → water \= false

---

# **47\. LOGIC XÁC ĐỊNH ÁNH SÁNG**

Chuồng 1:

light \= true

Chuồng 2:

có đèn → light \= true  
không có đèn → light \= false

---

# **48\. LOGIC XÁC ĐỊNH NHIỆT ĐỘ**

Chuồng 1:

temperature \= 37

Chuồng 2:

temperature \= giá trị cuối cùng do HS thiết lập

Sau đó xác định:

0–27  
28–31  
32–35  
36–39  
40–60

---

# **49\. LOGIC TỔNG HỢP KẾT QUẢ**

Hệ thống phải kiểm tra:

food  
water  
oxygen  
light  
temperature

Ví dụ:

food \= true  
water \= true  
oxygen \= false  
light \= false  
temperature \= 34

Kết quả:

* Có thức ăn.  
* Có nước.  
* Thiếu O₂.  
* Thiếu ánh sáng.  
* Nhiệt độ thuộc vùng 32–35°C.

Hành vi phải kết hợp:

> Khó thở \+ giảm hoạt động \+ vẫn có ăn uống \+ nhiệt độ phù hợp.

---

# **50\. ƯU TIÊN KẾT QUẢ CUỐI CÙNG**

Khi nhiều yếu tố cùng thiếu, hệ thống phải tổng hợp thay vì ghi đè.

Ví dụ:

O2 thiếu  
\+  
Nước thiếu  
\+  
Thức ăn thiếu

Không được chỉ hiện:

> “Gà thiếu nước.”

Mà phải thể hiện:

> **Gà đồng thời thiếu O₂, nước và thức ăn. Các yếu tố này cùng ảnh hưởng đến hoạt động và sự sống của gà.**

Có thể hiển thị bảng:

| Yếu tố | Trạng thái | Ảnh hưởng |
| ----- | ----- | ----- |
| O₂ | Thiếu | Khó thở, suy yếu |
| Nước | Thiếu | Mất nước, suy yếu |
| Thức ăn | Thiếu | Thiếu dinh dưỡng, suy kiệt |
| Ánh sáng | Có | Hoạt động bình thường hơn |
| Nhiệt độ | 34°C | Trong khoảng thích hợp |

---

# **51\. ANIMATION HÀNH VI GÀ**

Gà cần có nhiều trạng thái animation.

## **Bình thường**

* Đi lại.  
* Mổ thức ăn.  
* Uống nước.  
* Chớp mắt.  
* Kêu.  
* Nghỉ.

## **Tìm thức ăn**

* Mổ xuống sàn.  
* Đi qua lại.  
* Quay đầu.  
* Tìm kiếm.

## **Tìm nước**

* Đi quanh chuồng.  
* Quay đầu.  
* Kêu.  
* Tìm bát.

## **Thiếu O₂**

* Thở nhanh.  
* Há mỏ.  
* Vươn cổ.  
* Giảm vận động.

## **Nóng**

* Há mỏ.  
* Thở nhanh.  
* Xòe cánh.  
* Tìm chỗ mát.

## **Lạnh**

* Run.  
* Xù lông.  
* Co cụm.

## **Suy yếu**

* Đi chậm.  
* Ít hoạt động.  
* Nằm/ngồi nhiều hơn.  
* Phản ứng chậm.

Các animation phải chuyển tiếp mềm, tránh thay đổi trạng thái đột ngột.

---

# **52\. HIỆU ỨNG MÔI TRƯỜNG**

## **Chuồng bình thường**

* Ánh sáng tự nhiên.  
* Chuồng trong.  
* Không khí thông thoáng.

## **Chuồng kín**

* Kính mờ dần.  
* Có hơi nước ngưng tụ.

## **Thiếu ánh sáng**

* Ánh sáng môi trường giảm.  
* Chuồng tối.

## **Nóng**

* Hiệu ứng hơi nóng.  
* Tông môi trường nóng hơn.

## **Lạnh**

* Hiệu ứng lạnh.  
* Tông môi trường lạnh hơn.

---

# **53\. THIẾT KẾ UX CHO HỌC SINH TIỂU HỌC**

Nguyên tắc:

> **Một thao tác – một phản hồi rõ ràng.**

Không hiển thị quá nhiều chữ cùng lúc.

Mỗi thao tác nên có:

1. Hướng dẫn.  
2. Vùng tương tác.  
3. Hiệu ứng khi đúng.  
4. Thông báo khi sai.

Ví dụ:

> **Hãy kéo bát nước vào chuồng 2\.**

Khi đúng:

> **Đúng\! Gà đã có nước uống.**

---

# **54\. HỆ THỐNG PHẢN HỒI**

Phản hồi nên chia thành 3 loại.

## **Phản hồi đúng**

Có thể sử dụng:

* Glow.  
* Check.  
* Âm thanh nhẹ.  
* Animation.

Ví dụ:

> **Chính xác\!**

## **Phản hồi sai**

Không dùng màu đỏ quá mạnh hoặc biểu hiện thất bại.

Ví dụ:

> **Hãy đặt bát nước vào chuồng 2\.**

## **Phản hồi thông tin**

Ví dụ:

> **Chuồng 1 luôn được giữ đủ 5 yếu tố để làm điều kiện so sánh.**

---

# **55\. ÂM THANH**

Có thể bổ sung:

* Tiếng gà “chiếp chiếp”.  
* Tiếng nước.  
* Tiếng kéo/thả.  
* Âm thanh xác nhận.  
* Âm thanh chuyển ngày.  
* Âm thanh hoàn thành.

Âm thanh phải có nút:

> **BẬT/TẮT ÂM THANH**

---

# **56\. NÚT HƯỚNG DẪN**

Có thể có nút:

> **? HƯỚNG DẪN**

Khi nhấn, hiển thị ngắn:

> Em hãy đặt hai chuồng lên bàn, đưa gà vào đúng chuồng, sau đó thiết lập môi trường sống cho gà con B. Em có thể chọn những yếu tố muốn có hoặc không có trong chuồng 2\. Cuối cùng nhấn “Bắt đầu quan sát” để xem kết quả sau 7 ngày.

---

# **57\. MÀN HÌNH HOÀN THÀNH**

Sau khi xem kết quả:

Hiển thị:

> **THÍ NGHIỆM HOÀN THÀNH\!**

Bên dưới:

> **5 YẾU TỐ CẦN THIẾT CHO SỰ SỐNG CỦA ĐỘNG VẬT**

Hiển thị 5 biểu tượng:

* 🍚 Thức ăn  
* 💧 Nước  
* 🌬 Không khí  
* ☀ Ánh sáng  
* 🌡 Nhiệt độ thích hợp

Có thể đánh dấu:

> ✓ ✓ ✓ ✓ ✓

---

# **58\. KẾT LUẬN CUỐI CÙNG**

Hiển thị nổi bật:

> **Động vật cần thức ăn, nước, không khí, ánh sáng và nhiệt độ thích hợp để sống và phát triển. Khi thiếu một hoặc nhiều yếu tố cần thiết trong thời gian dài, hoạt động và sự phát triển của động vật sẽ bị ảnh hưởng, thậm chí có thể không sống được.**

---

# **59\. NÚT “LÀM LẠI THÍ NGHIỆM”**

Cuối màn hình có nút:

> **LÀM LẠI THÍ NGHIỆM**

Khi nhấn:

> **Em có chắc muốn làm lại thí nghiệm không?**

Hai nút:

> **HỦY**

> **LÀM LẠI**

Nếu chọn HỦY:

* Đóng hộp thoại.  
* Giữ nguyên kết quả.

Nếu chọn LÀM LẠI:

Reset toàn bộ:

* Chuồng.  
* Gà.  
* Thức ăn.  
* Nước.  
* Đèn.  
* Nắp.  
* Nhiệt độ.  
* Ngày quan sát.  
* Kết quả.  
* Animation.  
* Trạng thái hoàn thành.

Đưa toàn bộ vật dụng về vị trí ban đầu.

---

# **60\. COMPONENT HIERARCHY ĐỀ XUẤT**

Có thể tổ chức website thành:

ExperimentPage  
│  
├── Header  
│   ├── ExperimentTitle  
│   ├── HelpButton  
│   └── SoundButton  
│  
├── ProgressBar  
│  
├── MainScene  
│   │  
│   ├── GardenBackground  
│   ├── ExperimentTable  
│   │  
│   ├── Cage1  
│   │   ├── ChickA  
│   │   ├── Food  
│   │   ├── Water  
│   │   ├── Lamp  
│   │   └── TemperatureController  
│   │  
│   └── Cage2  
│       ├── ChickB  
│       ├── Food  
│       ├── Water  
│       ├── Lamp  
│       ├── Lid  
│       └── TemperatureController  
│  
├── MaterialTray  
│   ├── ChickA  
│   ├── ChickB  
│   ├── FoodTray  
│   ├── WaterBowl  
│   ├── Lamp  
│   └── CageLid  
│  
├── InstructionPanel  
├── FeedbackMessage  
├── StartObservationButton  
│  
├── TimeProgress  
│   ├── Day1  
│   ├── Day2  
│   ├── ...  
│   └── Day7  
│  
├── ResultPanel  
│   ├── Cage1Result  
│   ├── Cage2Result  
│   ├── ComparisonTable  
│   └── FactorAnalysis  
│  
├── ConclusionPanel  
└── ResetModal

---

# **61\. NGUYÊN TẮC LẬP TRÌNH QUAN TRỌNG**

Không xử lý kết quả theo kiểu:

if thiếu O2  
    kết quả \= thiếu O2  
else if thiếu nước  
    kết quả \= thiếu nước

Vì cách này khiến hệ thống chỉ nhận một nguyên nhân.

Thay vào đó phải:

missingFactors \= \[\]

if food \== false  
    missingFactors.push("food")

if water \== false  
    missingFactors.push("water")

if oxygen \== false  
    missingFactors.push("oxygen")

if light \== false  
    missingFactors.push("light")

temperatureResult \= calculateTemperature(temperature)

Sau đó:

behavior \= combineBehaviors(  
    missingFactors,  
    temperatureResult  
)

Cuối cùng:

finalResult \= calculateFinalResult(  
    missingFactors,  
    temperatureResult  
)

---

# **62\. HỆ THỐNG KẾT QUẢ NÊN TÁCH THÀNH 3 LỚP**

## **Lớp 1 – Điều kiện**

Ví dụ:

> Thiếu nước.

## **Lớp 2 – Hành vi**

Ví dụ:

> Gà tìm nước, kêu nhiều và giảm hoạt động.

## **Lớp 3 – Kết quả**

Ví dụ:

> Thiếu nước kéo dài làm gà suy yếu và ảnh hưởng đến sự sống.

Cách tổ chức này giúp animation và nội dung dễ mở rộng.

---

# **63\. NGUYÊN TẮC KHÔNG GÂY NHẦM LẪN**

Chuồng 1 là:

> **ĐIỀU KIỆN ĐỐI CHỨNG – LUÔN ĐỦ 5 YẾU TỐ**

Chuồng 2 là:

> **ĐIỀU KIỆN THÍ NGHIỆM – HỌC SINH TỰ THIẾT LẬP**

Hai chuồng phải luôn có sự khác biệt trực quan.

Có thể đặt nhãn:

> **CHUỒNG 1 – ĐỦ 5 YẾU TỐ**

và:

> **CHUỒNG 2 – EM TỰ THIẾT LẬP**

---

# **64\. TRẢI NGHIỆM NGƯỜI DÙNG HOÀN CHỈNH**

Luồng trải nghiệm:

MỞ THÍ NGHIỆM  
        ↓  
XEM HƯỚNG DẪN  
        ↓  
ĐẶT CHUỒNG 1 \+ CHUỒNG 2  
        ↓  
ĐẶT GÀ A → CHUỒNG 1  
        ↓  
ĐẶT GÀ B → CHUỒNG 2  
        ↓  
THIẾT LẬP MÔI TRƯỜNG CHUỒNG 2  
        ↓  
THỨC ĂN  
NƯỚC  
ÁNH SÁNG  
O₂ / NẮP  
NHIỆT ĐỘ  
        ↓  
BẮT ĐẦU QUAN SÁT  
        ↓  
NGÀY 1  
        ↓  
NGÀY 2  
        ↓  
...  
        ↓  
NGÀY 7  
        ↓  
HIỂN THỊ KẾT QUẢ  
        ↓  
SO SÁNH CHUỒNG 1 – CHUỒNG 2  
        ↓  
PHÂN TÍCH 5 YẾU TỐ  
        ↓  
KẾT LUẬN  
        ↓  
THÍ NGHIỆM HOÀN THÀNH  
        ↓  
LÀM LẠI

---

# **65\. NGUYÊN TẮC THIẾT KẾ CUỐI CÙNG**

Website phải tạo cảm giác:

> **Học sinh đang trực tiếp làm một thí nghiệm khoa học.**

Không nên thiết kế như một bài đọc lý thuyết đơn thuần.

Trọng tâm cần ưu tiên:

### **1\. TƯƠNG TÁC**

Kéo – thả vật dụng.

### **2\. QUAN SÁT**

Nhìn thấy sự thay đổi của gà và môi trường.

### **3\. THỜI GIAN**

Có mô phỏng từ ngày 1 đến ngày 7\.

### **4\. SO SÁNH**

Chuồng 1 và chuồng 2 phải được quan sát song song.

### **5\. PHÂN TÍCH**

Học sinh nhìn thấy yếu tố nào có, yếu tố nào thiếu và ảnh hưởng tương ứng.

### **6\. KẾT LUẬN**

Kiến thức xuất hiện sau quá trình thao tác và quan sát.

Toàn bộ trải nghiệm cần tuân theo:

> **THAO TÁC → QUAN SÁT → PHẢN HỒI → PHÂN TÍCH → KẾT LUẬN**

Đây là nguyên tắc cốt lõi để biến website thành **một thí nghiệm khoa học tương tác**, thay vì chỉ là một trang web trình bày kiến thức.

# THÍ NGHIỆM 4

# **THÍ NGHIỆM 4**

# **TÌM HIỂU SỰ TRAO ĐỔI NƯỚC, KHÔNG KHÍ VÀ THỨC ĂN CỦA ĐỘNG VẬT VỚI MÔI TRƯỜNG**

## **Đối tượng quan sát: CHUỘT BẠCH**

---

# **1\. MỤC ĐÍCH CỦA WEB THÍ NGHIỆM**

Xây dựng một website thí nghiệm khoa học tương tác dành cho học sinh tiểu học.

Học sinh không chỉ đọc nội dung lý thuyết mà phải trực tiếp thao tác với mô hình chuột bạch để quan sát quá trình động vật trao đổi chất với môi trường.

Thông qua các thao tác kéo – thả, nhấp chọn, phóng to và quan sát animation, học sinh nhận biết được:

* Động vật lấy khí O₂ từ môi trường.  
* Động vật thải khí CO₂ ra môi trường.  
* Động vật lấy nước từ môi trường.  
* Động vật lấy thức ăn từ môi trường.  
* Cơ thể sử dụng thức ăn để cung cấp chất dinh dưỡng.  
* Cơ thể thải chất cặn bã ra môi trường.  
* Cơ thể thải nước tiểu ra môi trường.

Nguyên tắc trải nghiệm của toàn bộ thí nghiệm:

> **THAO TÁC → QUAN SÁT → PHẢN HỒI → HIỂU → KẾT LUẬN**

Website phải tạo cảm giác học sinh đang trực tiếp thực hiện một thí nghiệm khoa học chứ không phải chỉ đọc một bài học.

---

# **2\. BỐ CỤC GIAO DIỆN TỔNG THỂ**

Màn hình thí nghiệm được chia thành các khu vực:

## **Khu vực 1 – KHAY DỤNG CỤ**

Nằm cố định ở bên trái màn hình.

Đây là nơi chứa toàn bộ vật dụng mà học sinh có thể sử dụng.

## **Khu vực 2 – BÀN QUAN SÁT**

Nằm ở trung tâm màn hình.

Đây là khu vực học sinh đưa chuột và các vật dụng vào để thực hiện thí nghiệm.

## **Khu vực 3 – THANH TIẾN TRÌNH**

Nằm ở phía trên màn hình.

Hiển thị:

> **CHUỘT → LẤY VÀO → SỬ DỤNG → THẢI RA**

Thanh tiến trình phản ánh tiến độ chung của thí nghiệm.

## **Khu vực 4 – NÚT TƯƠNG TÁC CHÍNH**

Nằm phía trên hoặc ngay bên dưới khu vực bàn quan sát.

Gồm:

> **TRAO ĐỔI KHÍ**

và

> **TRAO ĐỔI NƯỚC, THỨC ĂN VÀ CHẤT THẢI**

Hai nội dung không bắt buộc phải thực hiện theo thứ tự.

Sau khi đặt chuột đúng vị trí, học sinh có thể lựa chọn nội dung muốn quan sát trước.

## **Khu vực 5 – NÚT LÀM LẠI**

Luôn hiển thị ở góc dưới bên phải:

> **LÀM LẠI THÍ NGHIỆM**

Nút phải đủ lớn để học sinh dễ nhìn và nhấp.

---

# **3\. NÚT “LÀM LẠI THÍ NGHIỆM”**

Nút này luôn được kích hoạt trong toàn bộ quá trình.

Học sinh có thể làm lại thí nghiệm bất kỳ lúc nào.

Khi nhấp:

> **Em có chắc muốn làm lại thí nghiệm không?**

Bên dưới hiển thị hai nút:

> **HỦY**

và

> **LÀM LẠI**

## **3.1. Nếu chọn HỦY**

Hệ thống:

* Đóng hộp thoại.  
* Không thay đổi dữ liệu.  
* Không thay đổi vị trí vật dụng.  
* Giữ nguyên toàn bộ tiến trình.  
* Tiếp tục thí nghiệm tại đúng bước đang thực hiện.

## **3.2. Nếu chọn LÀM LẠI**

Hệ thống reset toàn bộ thí nghiệm.

Cụ thể:

1. Xóa toàn bộ kết quả quan sát.  
2. Dừng tất cả animation đang chạy.  
3. Dừng hiệu ứng chuyển động.  
4. Đưa chuột bạch về trạng thái ban đầu.  
5. Đưa chuột về vị trí ban đầu trong khay.  
6. Xóa thức ăn đã sử dụng.  
7. Xóa nước đã sử dụng.  
8. Xóa các mũi tên khí.  
9. Xóa các phân tử O₂.  
10. Xóa CO₂.  
11. Xóa chất cặn bã.  
12. Xóa nước tiểu.  
13. Xóa các hiệu ứng thải.  
14. Xóa toàn bộ thông tin đã mở.  
15. Đóng các bảng thông tin.  
16. Đóng chế độ phóng to.  
17. Đưa tất cả dụng cụ về khay bên trái.  
18. Đưa bàn quan sát về trạng thái trống.  
19. Xóa trạng thái hoàn thành của các bước.  
20. Đưa thanh tiến trình về bước đầu tiên.  
21. Khóa các nội dung chưa được thực hiện.  
22. Reset toàn bộ biến trạng thái.  
23. Đưa giao diện về trạng thái ban đầu.

Sau khi reset:

> **Thí nghiệm bắt đầu lại từ đầu.**

---

# **4\. KHAY DỤNG CỤ CỐ ĐỊNH**

Khu vực bên trái màn hình là:

> **KHAY DỤNG CỤ THÍ NGHIỆM**

Các vật dụng được đặt cố định trong khay.

Học sinh có thể kéo – thả vật dụng từ khay lên bàn quan sát.

Khay gồm:

1. Chuột bạch.  
2. Khay thức ăn.  
3. Bát nước.  
4. Kính phóng đại 3D.

Ngoài ra, các thành phần phục vụ mô phỏng như:

* O₂.  
* CO₂.  
* Chất cặn bã.  
* Nước tiểu.

có thể xuất hiện theo từng bước thay vì phải luôn nằm trong khay.

---

# **5\. THIẾT KẾ CHUỘT BẠCH**

Có:

> **1 mô hình chuột bạch trưởng thành 3D**

Chuột phải được thiết kế:

* Chân thật.  
* Thân thiện với học sinh.  
* Không gây cảm giác đáng sợ.  
* Tỷ lệ cơ thể hợp lý.  
* Có animation chuyển động.  
* Có thể quan sát từ nhiều góc.

Trạng thái ban đầu:

> **Khỏe mạnh**

Chuột ở trong khay dụng cụ.

---

# **6\. THÔNG TIN CHUỘT BẠCH**

Khi học sinh nhấp vào chuột, mở bảng thông tin:

| Thông tin | Chuột bạch |
| ----- | ----- |
| Loài | Chuột bạch |
| Giai đoạn | Trưởng thành |
| Tình trạng | Khỏe mạnh |

Bảng này chỉ có tác dụng cung cấp thông tin.

Việc mở bảng:

* Không làm thay đổi thí nghiệm.  
* Không thay đổi trạng thái chuột.  
* Không mở bước mới.  
* Không ảnh hưởng kết quả.

Có nút:

> **ĐÓNG**

để đóng bảng.

---

# **7\. KHAY THỨC ĂN**

Có:

> **1 khay thức ăn nhỏ**

Trong khay có thức ăn phù hợp cho chuột.

Ban đầu khay nằm trong khu vực dụng cụ.

Khi học sinh kéo khay vào khu vực quan sát:

* Khay được đặt xuống.  
* Chuột có thể di chuyển đến gần.  
* Chuột cúi xuống ăn.  
* Thức ăn giảm dần theo animation.

---

# **8\. BÁT NƯỚC**

Có:

> **1 bát nước sạch**

Ban đầu bát nước nằm trong khay dụng cụ.

Khi học sinh kéo bát vào:

* Bát được đặt gần chuột.  
* Chuột di chuyển tới bát.  
* Chuột cúi đầu uống.  
* Mực nước giảm nhẹ.

---

# **9\. KÍNH PHÓNG ĐẠI 3D**

Có:

> **1 kính phóng đại 3D**

Kính dùng để quan sát chi tiết các đối tượng.

Học sinh có thể sử dụng kính để quan sát:

* Chuột.  
* Thức ăn.  
* Nước.  
* Đường đi của O₂.  
* Đường đi của CO₂.  
* Chất cặn bã.  
* Nước tiểu.

Khi đưa kính tới đối tượng:

* Đối tượng được phóng to.  
* Có thể xuất hiện vùng highlight.  
* Có nhãn tên.  
* Có animation nếu đối tượng đang chuyển động.

---

# **10\. BÀN QUAN SÁT**

Ở trung tâm màn hình là:

> **BÀN QUAN SÁT BẰNG GỖ**

Bàn đặt trong không gian:

* Sạch sẽ.  
* Sáng rõ.  
* Thân thiện.  
* Không có vật thể thừa.

Trên bàn ban đầu không có chuột.

Sau khi học sinh đặt chuột, chuột nằm ở vị trí trung tâm.

Khu vực xung quanh chuột là vùng để đặt:

* Thức ăn.  
* Nước.  
* Khu vực chất thải.

---

# **11\. THANH TIẾN TRÌNH**

Phía trên màn hình hiển thị:

> **CHUỘT → LẤY VÀO → SỬ DỤNG → THẢI RA**

Có thể chia thành 4 trạng thái:

### **Bước 1**

> **CHUỘT**

Học sinh đưa chuột lên bàn.

### **Bước 2**

> **LẤY VÀO**

Quan sát những gì chuột lấy từ môi trường:

* O₂.  
* Nước.  
* Thức ăn.

### **Bước 3**

> **SỬ DỤNG**

Quan sát cơ thể sử dụng:

* O₂.  
* Nước.  
* Chất dinh dưỡng từ thức ăn.

### **Bước 4**

> **THẢI RA**

Quan sát:

* CO₂.  
* Chất cặn bã.  
* Nước tiểu.

Các bước có thể sáng dần khi hoàn thành.

---

# **12\. HAI NỘI DUNG TƯƠNG TÁC CHÍNH**

Sau khi đặt chuột đúng vị trí, mở hai nút:

> **TRAO ĐỔI KHÍ**

> **TRAO ĐỔI NƯỚC, THỨC ĂN VÀ CHẤT THẢI**

Hai nút:

* Không bị khóa lẫn nhau.  
* Không yêu cầu thứ tự cố định.  
* Học sinh có thể chọn nội dung nào trước.

---

# **13\. TRẠNG THÁI BAN ĐẦU**

Khi mở thí nghiệm:

* Chuột nằm trong khay.  
* Thức ăn trong khay.  
* Bát nước trong khay.  
* Kính phóng đại trong khay.  
* Bàn trống.  
* Hai nút nội dung bị khóa.

Hiển thị hướng dẫn:

> **Hãy kéo chuột bạch lên bàn quan sát để bắt đầu.**

---

# **14\. THAO TÁC ĐẶT CHUỘT**

Học sinh kéo:

> **CHUỘT BẠCH → BÀN QUAN SÁT**

## **Khi kéo đúng**

Chuột được đặt đúng vị trí.

Hiệu ứng:

* Chuột đáp xuống nhẹ.  
* Vòng sáng nhẹ xuất hiện dưới chuột.  
* Chuột bắt đầu animation thở/chuyển động nhẹ.

Hiển thị:

> **Đã đặt chuột bạch. Hãy tìm hiểu sự trao đổi chất của chuột với môi trường.**

Hai nút được mở:

> **TRAO ĐỔI KHÍ**

> **TRAO ĐỔI NƯỚC, THỨC ĂN VÀ CHẤT THẢI**

## **Khi kéo sai**

Nếu thả chuột ngoài khu vực bàn:

> **Hãy đặt chuột bạch vào khu vực quan sát.**

Chuột tự động quay lại khay.

---

# **15\. RÀNG BUỘC TRƯỚC KHI ĐẶT CHUỘT**

Khi:

> mousePlaced \= false

thì:

* TRAO ĐỔI KHÍ \= LOCKED.  
* TRAO ĐỔI NƯỚC, THỨC ĂN VÀ CHẤT THẢI \= LOCKED.

Không cho phép mở nội dung bằng cách nhấp trực tiếp.

---

# **16\. TƯƠNG TÁC TRAO ĐỔI KHÍ**

Khi học sinh nhấp:

> **TRAO ĐỔI KHÍ**

Giao diện chuyển sang chế độ quan sát bên trong cơ thể chuột.

Có thể sử dụng hiệu ứng:

* Camera zoom vào đầu chuột.  
* Hiện vùng mũi.  
* Đường hô hấp.  
* Phổi.  
* Cơ thể được làm bán trong suốt hoặc chuyển sang mô hình giải phẫu đơn giản.

Hiển thị:

> **HÔ HẤP**

Chỉ sử dụng nội dung hô hấp.

**Không hiển thị hoặc sử dụng “QUANG HỢP”.**

Lý do:

> **Chuột là động vật nên không thực hiện quang hợp.**

---

# **17\. MÀN HÌNH HÔ HẤP**

Camera tập trung vào:

> **MŨI → ĐƯỜNG HÔ HẤP → PHỔI**

Hiển thị thông tin:

> **Chuột lấy khí oxygen (O₂) từ môi trường để hô hấp và thải khí carbon dioxide (CO₂) ra môi trường.**

Hai loại khí xuất hiện:

> **O₂**

> **CO₂**

Các phân tử khí có animation chuyển động nhẹ.

O₂ có đường đi:

> **MÔI TRƯỜNG → MŨI → ĐƯỜNG HÔ HẤP → PHỔI**

CO₂ có đường đi:

> **PHỔI → ĐƯỜNG HÔ HẤP → MÔI TRƯỜNG**

---

# **18\. TƯƠNG TÁC ĐƯA O₂ VÀO CƠ THỂ**

Yêu cầu:

> **Hãy kéo khí O₂ từ môi trường vào cơ thể chuột.**

Học sinh kéo O₂ từ vùng môi trường về phía mũi chuột.

## **Khi kéo đúng**

O₂:

1. Di chuyển đến mũi.  
2. Đi vào đường hô hấp.  
3. Đi xuống phổi.  
4. Dừng ở vùng phổi.  
5. Hiển thị hiệu ứng hấp thụ.

Đồng thời:

* Chuột thở bình thường.  
* Lồng ngực có thể chuyển động nhẹ.  
* Đường đi của O₂ được highlight.

Hiển thị:

> **Chính xác\! Chuột lấy khí O₂ từ môi trường để hô hấp.**

Đánh dấu:

> **O₂ VÀO ✓**

---

# **19\. KHI KÉO O₂ SAI**

Nếu học sinh kéo O₂ ra xa khỏi cơ thể:

> **Chưa đúng. Hãy đưa O₂ từ môi trường vào cơ thể chuột.**

O₂ quay lại vị trí ban đầu.

Không thay đổi tiến trình.

Học sinh được thử lại.

---

# **20\. MỞ TƯƠNG TÁC CO₂**

Sau khi O₂ được đưa vào đúng vị trí, mở nhiệm vụ:

> **Chuột thải khí nào ra môi trường khi hô hấp?**

Hiển thị CO₂ rõ hơn.

Yêu cầu:

> **Hãy kéo CO₂ từ phổi ra môi trường.**

---

# **21\. TƯƠNG TÁC ĐƯA CO₂ RA NGOÀI**

Học sinh kéo CO₂:

> **PHỔI → ĐƯỜNG HÔ HẤP → MŨI → MÔI TRƯỜNG**

## **Khi đúng**

Hiệu ứng:

* CO₂ di chuyển ra ngoài.  
* Xuất hiện mũi tên.  
* Khí thoát ra môi trường.  
* Chuột tiếp tục thở.

Hiển thị:

> **Chính xác\! Chuột thải khí CO₂ ra môi trường.**

Đánh dấu:

> **CO₂ RA ✓**

---

# **22\. KHI KÉO CO₂ SAI**

Nếu học sinh kéo CO₂ vào cơ thể:

> **Chưa đúng. Khi hô hấp, chuột thải CO₂ ra môi trường.**

CO₂ quay lại vị trí ban đầu.

Không tính hoàn thành.

---

# **23\. HOÀN THÀNH TRAO ĐỔI KHÍ**

Khi cả hai điều kiện:

oxygenIn \= true  
carbonDioxideOut \= true

thì:

> **TRAO ĐỔI KHÍ ✓**

Hiển thị đồng thời:

> **O₂: MÔI TRƯỜNG → CHUỘT**

và:

> **CO₂: CHUỘT → MÔI TRƯỜNG**

Thông báo:

> **Chuột thường xuyên trao đổi khí với môi trường: lấy O₂ vào cơ thể và thải CO₂ ra môi trường.**

Thanh tiến trình cập nhật.

---

# **24\. TƯƠNG TÁC TRAO ĐỔI NƯỚC, THỨC ĂN VÀ CHẤT THẢI**

Học sinh có thể nhấp nội dung này trước hoặc sau phần trao đổi khí.

Khi mở:

* Camera trở về góc nhìn bên ngoài.  
* Chuột xuất hiện đầy đủ.  
* Khay thức ăn xuất hiện.  
* Bát nước xuất hiện.  
* Khu vực chất thải được chuẩn bị.

Hiển thị:

> **Động vật lấy nước và thức ăn từ môi trường. Sau khi sử dụng, cơ thể thải các chất cặn bã và nước tiểu ra môi trường.**

---

# **25\. TƯƠNG TÁC CUNG CẤP THỨC ĂN**

Yêu cầu:

> **Hãy cung cấp thức ăn cho chuột.**

Học sinh kéo:

> **KHAY THỨC ĂN → GẦN CHUỘT**

## **Khi đúng**

Khay được đặt xuống.

Chuột:

1. Nhìn về phía thức ăn.  
2. Di chuyển đến khay.  
3. Cúi xuống.  
4. Mổ/ăn thức ăn.  
5. Thức ăn trong khay giảm dần.

Có thể thêm animation:

> **ĂN → NHAI → NUỐT**

Hiển thị:

> **Chuột lấy thức ăn từ môi trường để cung cấp chất dinh dưỡng cho cơ thể.**

Đánh dấu:

> **THỨC ĂN ✓**

---

# **26\. KHI ĐẶT THỨC ĂN SAI**

Nếu thả ngoài vùng quy định:

> **Hãy đặt thức ăn gần chuột.**

Khay tự động quay lại vị trí ban đầu.

Không làm thay đổi trạng thái.

---

# **27\. TƯƠNG TÁC CUNG CẤP NƯỚC**

Sau khi thức ăn được đưa vào đúng vị trí, hiển thị:

> **Hãy cung cấp nước cho chuột.**

Học sinh kéo:

> **BÁT NƯỚC → GẦN CHUỘT**

---

# **28\. KHI ĐẶT NƯỚC ĐÚNG**

Bát nước được đặt xuống.

Chuột:

1. Nhìn về phía bát.  
2. Di chuyển tới bát.  
3. Cúi đầu.  
4. Uống nước.  
5. Mực nước giảm nhẹ.

Hiển thị:

> **Chuột lấy nước từ môi trường để duy trì hoạt động của cơ thể.**

Đánh dấu:

> **NƯỚC ✓**

---

# **29\. KHI ĐẶT NƯỚC SAI**

Hiển thị:

> **Hãy đặt bát nước gần chuột.**

Bát nước quay lại vị trí gần nhất/vị trí ban đầu.

---

# **30\. TUA NHANH SAU KHI CHUỘT ĂN VÀ UỐNG**

Sau khi:

* Thức ăn hoàn thành.  
* Nước hoàn thành.

Hệ thống tua nhanh một khoảng thời gian ngắn.

Hiển thị:

> **MỘT KHOẢNG THỜI GIAN SAU...**

Chuột:

* Hoạt động bình thường.  
* Di chuyển.  
* Nghỉ.  
* Tiêu hóa thức ăn.

Sau đó mở bước:

> **THẢI RA**

---

# **31\. TƯƠNG TÁC CHẤT CẶN BÃ**

Xuất hiện khu vực:

> **CHẤT CẶN BÃ**

Hiển thị:

> **Sau khi sử dụng thức ăn, cơ thể thải chất cặn bã. Hãy xác định chất được thải ra môi trường.**

Học sinh có thể:

* Nhấp vào chất cặn bã.  
* Hoặc kéo chất cặn bã ra khu vực thải.

---

# **32\. KHI XỬ LÝ CHẤT CẶN BÃ ĐÚNG**

Chất cặn bã được đưa ra ngoài cơ thể.

Hiệu ứng:

* Chất cặn bã di chuyển ra vùng thải.  
* Có mũi tên từ chuột → môi trường.  
* Khu vực thải được highlight.

Hiển thị:

> **Đúng\! Cơ thể thải chất cặn bã ra môi trường.**

Đánh dấu:

> **CHẤT CẶN BÃ ✓**

---

# **33\. KHI XỬ LÝ CHẤT CẶN BÃ SAI**

Nếu học sinh đưa chất cặn bã vào cơ thể:

> **Chưa đúng. Chất cặn bã là chất được cơ thể thải ra môi trường.**

Chất cặn bã quay lại vị trí ban đầu.

---

# **34\. TƯƠNG TÁC NƯỚC TIỂU**

Sau khi hoàn thành chất cặn bã:

Hiển thị:

> **NƯỚC TIỂU**

Yêu cầu:

> **Hãy đưa nước tiểu ra khỏi cơ thể chuột.**

Học sinh kéo nước tiểu:

> **CƠ THỂ → MÔI TRƯỜNG**

---

# **35\. KHI ĐƯA NƯỚC TIỂU ĐÚNG**

Nước tiểu di chuyển ra ngoài.

Hiệu ứng:

* Mũi tên hướng ra ngoài.  
* Vùng thải sáng nhẹ.  
* Animation thải.

Hiển thị:

> **Chính xác\! Chuột thải nước tiểu ra môi trường.**

Đánh dấu:

> **NƯỚC TIỂU ✓**

---

# **36\. KHI ĐƯA NƯỚC TIỂU SAI**

Nếu kéo nước tiểu vào trong:

> **Chưa đúng. Nước tiểu là chất được cơ thể thải ra môi trường.**

Nước tiểu quay về vị trí ban đầu.

---

# **37\. HOÀN THÀNH TRAO ĐỔI NƯỚC, THỨC ĂN VÀ CHẤT THẢI**

Khi hoàn thành:

foodIn \= true  
waterIn \= true  
wasteOut \= true  
urineOut \= true

Hệ thống đánh dấu:

> **TRAO ĐỔI NƯỚC, THỨC ĂN VÀ CHẤT THẢI ✓**

Thông báo:

> **Chuột lấy nước và thức ăn từ môi trường, sau đó thải các chất cặn bã và nước tiểu ra môi trường.**

---

# **38\. MÀN HÌNH KẾT QUẢ TỔNG HỢP**

Sau khi hoàn thành cả hai nội dung, hệ thống chuyển sang:

> **KẾT QUẢ QUAN SÁT**

Chuột trở lại trạng thái khỏe mạnh và hoạt động bình thường.

Hiển thị toàn bộ dòng trao đổi cùng lúc.

---

# **39\. CÁC CHẤT ĐƯỢC LẤY VÀO**

Hiển thị các mũi tên:

> **MÔI TRƯỜNG → O₂ → CHUỘT**

> **MÔI TRƯỜNG → NƯỚC → CHUỘT**

> **MÔI TRƯỜNG → THỨC ĂN → CHUỘT**

Các mũi tên có animation chuyển động hướng vào cơ thể.

---

# **40\. CÁC CHẤT ĐƯỢC THẢI RA**

Hiển thị:

> **CHUỘT → CO₂ → MÔI TRƯỜNG**

> **CHUỘT → CHẤT CẶN BÃ → MÔI TRƯỜNG**

> **CHUỘT → NƯỚC TIỂU → MÔI TRƯỜNG**

Các mũi tên hướng từ chuột ra ngoài.

---

# **41\. SƠ ĐỒ TRAO ĐỔI TỔNG HỢP**

Có thể hiển thị sơ đồ trung tâm:

                   MÔI TRƯỜNG  
                         │  
             ┌───────────┼───────────┐  
             ↓           ↓           ↓  
            O₂         NƯỚC       THỨC ĂN  
             │           │           │  
             └───────────┼───────────┘  
                         ↓  
                    CHUỘT BẠCH  
                         │  
             ┌───────────┼───────────┐  
             ↓           ↓           ↓  
            CO₂      CHẤT CẶN BÃ   NƯỚC TIỂU  
             │           │           │  
             └───────────┼───────────┘  
                         ↓  
                    MÔI TRƯỜNG

Các dòng có thể chạy animation liên tục để tạo cảm giác chuột luôn trao đổi chất với môi trường.

---

# **42\. KẾT LUẬN KIẾN THỨC**

Màn hình cuối hiển thị:

> **Động vật thường xuyên trao đổi chất với môi trường. Chúng lấy khí O₂, nước và thức ăn từ môi trường để duy trì sự sống và hoạt động. Sau đó, cơ thể thải khí CO₂, chất cặn bã và nước tiểu ra môi trường.**

Có thể làm nổi bật các từ:

> **O₂ – NƯỚC – THỨC ĂN**

và:

> **CO₂ – CHẤT CẶN BÃ – NƯỚC TIỂU**

---

# **43\. BẢNG TỔNG HỢP**

Có thể hiển thị bảng:

| Hoạt động | Chất | Hướng trao đổi |
| ----- | ----- | ----- |
| Hô hấp | O₂ | Môi trường → Chuột |
| Hô hấp | CO₂ | Chuột → Môi trường |
| Uống nước | Nước | Môi trường → Chuột |
| Ăn | Thức ăn | Môi trường → Chuột |
| Thải | Chất cặn bã | Chuột → Môi trường |
| Thải | Nước tiểu | Chuột → Môi trường |

---

# **44\. LOGIC KHÓA/MỞ**

## **STATE 0 – BAN ĐẦU**

mousePlaced \= false

Khóa:

* TRAO ĐỔI KHÍ.  
* TRAO ĐỔI NƯỚC, THỨC ĂN VÀ CHẤT THẢI.

---

## **STATE 1 – ĐÃ ĐẶT CHUỘT**

mousePlaced \= true

Mở:

* TRAO ĐỔI KHÍ.  
* TRAO ĐỔI NƯỚC, THỨC ĂN VÀ CHẤT THẢI.

Hai nội dung độc lập về thứ tự.

---

# **45\. LOGIC TRAO ĐỔI KHÍ**

Khi chọn:

airExchange

mở:

respiration

Không có:

photosynthesis

## **Bước O₂**

oxygenIn \= false

Chỉ sau khi kéo đúng:

oxygenIn \= true

mới mở bước CO₂.

## **Bước CO₂**

carbonDioxideOut \= false

Khi kéo đúng:

carbonDioxideOut \= true

## **Hoàn thành**

airExchangeCompleted \=  
    oxygenIn &&  
    carbonDioxideOut

---

# **46\. LOGIC TRAO ĐỔI NƯỚC, THỨC ĂN VÀ CHẤT THẢI**

Có 4 trạng thái:

foodIn  
waterIn  
wasteOut  
urineOut

Trình tự:

foodIn  
   ↓  
waterIn  
   ↓  
wasteOut  
   ↓  
urineOut

Chỉ mở bước tiếp theo sau khi bước trước hoàn thành.

Hoàn thành:

waterFoodWasteCompleted \=  
    foodIn &&  
    waterIn &&  
    wasteOut &&  
    urineOut

---

# **47\. LOGIC HOÀN THÀNH TOÀN BỘ**

Thí nghiệm hoàn thành khi:

airExchangeCompleted \=== true

và:

waterFoodWasteCompleted \=== true

Tức là:

experimentCompleted \=  
    airExchangeCompleted &&  
    waterFoodWasteCompleted

Khi đó:

* Thanh tiến trình hoàn thành.  
* Mở màn hình kết luận.  
* Hiển thị sơ đồ tổng hợp.  
* Hiển thị bảng kết quả.  
* Cho phép xem lại tương tác.  
* Nút làm lại vẫn hoạt động.

---

# **48\. CÁC BIẾN TRẠNG THÁI ĐỀ XUẤT**

Có thể khai báo:

mousePlaced

airExchangeOpened  
respirationOpened

oxygenIn  
carbonDioxideOut

airExchangeCompleted

waterFoodWasteOpened

foodIn  
waterIn  
wasteOut  
urineOut

waterFoodWasteCompleted

experimentCompleted

currentStep

---

# **49\. CẤU TRÚC COMPONENT ĐỀ XUẤT**

Experiment4Page  
│  
├── Header  
│   ├── ExperimentTitle  
│   ├── HelpButton  
│   └── SoundButton  
│  
├── ProgressBar  
│  
├── MainScene  
│   ├── GardenOrLabBackground  
│   ├── ObservationTable  
│   └── Mouse  
│       ├── Body  
│       ├── Nose  
│       ├── RespiratorySystem  
│       └── Lungs  
│  
├── ToolTray  
│   ├── MouseTool  
│   ├── FoodTrayTool  
│   ├── WaterBowlTool  
│   └── MagnifyingGlassTool  
│  
├── MainInteraction  
│   ├── AirExchangeButton  
│   └── WaterFoodWasteButton  
│  
├── AirExchangePanel  
│   └── RespirationPanel  
│       ├── Oxygen  
│       ├── CarbonDioxide  
│       ├── Nose  
│       ├── Airway  
│       └── Lungs  
│  
├── WaterFoodWastePanel  
│   ├── FoodInteraction  
│   ├── WaterInteraction  
│   ├── WasteInteraction  
│   └── UrineInteraction  
│  
├── Magnifier  
│  
├── InstructionPanel  
├── FeedbackPanel  
├── ResultPanel  
├── ConclusionPanel  
└── ResetButton

---

# **50\. QUY TẮC KÉO – THẢ**

Tất cả vật thể kéo – thả phải có:

### **Trạng thái bình thường**

Vật thể đứng yên.

### **Hover**

Vật thể:

* Sáng nhẹ.  
* Phóng to nhẹ.  
* Hiển thị cursor kéo.

### **Drag**

Vật thể:

* Đi theo chuột.  
* Có bóng.  
* Có hiệu ứng nổi.

### **Drop đúng**

Vật thể:

* Snap vào vị trí.  
* Phát animation.  
* Hiển thị phản hồi.  
* Cập nhật state.

### **Drop sai**

Vật thể:

* Không được giữ tại vị trí sai.  
* Quay về vị trí ban đầu.  
* Hiển thị hướng dẫn.  
* Không cập nhật state.

---

# **51\. QUY TẮC PHẢN HỒI KHI SAI**

Không phạt học sinh.

Không trừ điểm.

Không khóa bước.

Không reset toàn bộ thí nghiệm.

Chỉ:

1. Hiển thị thông báo ngắn.  
2. Đưa vật thể về vị trí ban đầu.  
3. Cho phép thử lại.

Ví dụ:

> **Hãy đặt chuột bạch vào khu vực quan sát.**

> **Hãy đưa O₂ từ môi trường vào cơ thể chuột.**

> **Hãy đặt thức ăn gần chuột.**

> **Hãy đặt bát nước gần chuột.**

> **Chưa đúng. CO₂ được thải ra môi trường khi hô hấp.**

---

# **52\. QUY TẮC PHẢN HỒI KHI ĐÚNG**

Khi thao tác đúng:

* Đối tượng phát sáng nhẹ.  
* Có dấu ✓.  
* Animation được thực hiện.  
* Có âm thanh xác nhận nếu bật âm thanh.  
* Hiển thị thông báo.

Ví dụ:

> **Chính xác\! Chuột lấy khí O₂ từ môi trường để hô hấp.**

---

# **53\. THIẾT KẾ CAMERA**

Website nên có nhiều chế độ camera.

## **Camera tổng quan**

Nhìn toàn bộ:

* Bàn.  
* Chuột.  
* Dụng cụ.

## **Camera quan sát chuột**

Zoom vào chuột.

## **Camera hô hấp**

Zoom vào:

> Mũi → đường hô hấp → phổi.

## **Camera thải**

Có thể zoom vào khu vực chất thải khi thực hiện bước thải.

Chuyển camera cần:

* Smooth.  
* Không giật.  
* Có animation chuyển cảnh.  
* Có nút quay lại góc nhìn tổng quan.

---

# **54\. THIẾT KẾ KÍNH PHÓNG ĐẠI**

Kính phóng đại phải có cảm giác là một dụng cụ thật.

Khi sử dụng:

* Hiện vòng tròn phóng đại.  
* Phần bên trong kính được zoom.  
* Có thể hiện nhãn.

Ví dụ:

> **PHỔI**

> **O₂**

> **CO₂**

> **THỨC ĂN**

> **NƯỚC**

> **CHẤT CẶN BÃ**

> **NƯỚC TIỂU**

---

# **55\. ANIMATION TRAO ĐỔI KHÍ**

## **O₂**

Animation:

O₂  
↓  
Mũi  
↓  
Đường hô hấp  
↓  
Phổi

## **CO₂**

Animation:

Phổi  
↓  
Đường hô hấp  
↓  
Mũi  
↓  
Môi trường

Các phân tử khí nên chuyển động mềm và liên tục.

---

# **56\. ANIMATION THỨC ĂN**

Khi thức ăn được đưa vào:

Khay thức ăn  
      ↓  
Chuột đến gần  
      ↓  
Ăn  
      ↓  
Nhai  
      ↓  
Nuốt  
      ↓  
Sử dụng chất dinh dưỡng

Sau đó chuyển sang quá trình thải chất cặn bã.

---

# **57\. ANIMATION NƯỚC**

Khi bát nước được đưa vào:

Bát nước  
   ↓  
Chuột đến gần  
   ↓  
Uống  
   ↓  
Nước đi vào cơ thể

Mực nước trong bát giảm nhẹ để tạo cảm giác thực tế.

---

# **58\. ANIMATION THẢI**

## **CO₂**

> Chuột → CO₂ → môi trường

## **Chất cặn bã**

> Chuột → chất cặn bã → khu vực thải

## **Nước tiểu**

> Chuột → nước tiểu → khu vực thải

Các animation cần rõ ràng nhưng phù hợp với học sinh tiểu học.

Không sử dụng hình ảnh quá chi tiết hoặc gây khó chịu.

---

# **59\. GIAO DIỆN KẾT THÚC**

Sau khi hoàn thành:

Hiển thị lớn:

> **THÍ NGHIỆM HOÀN THÀNH\!**

Bên dưới:

> **CHUỘT BẠCH ĐÃ TRAO ĐỔI CHẤT VỚI MÔI TRƯỜNG**

Có thể hiển thị 6 dòng:

> ✓ Môi trường → O₂ → Chuột

> ✓ Môi trường → Nước → Chuột

> ✓ Môi trường → Thức ăn → Chuột

> ✓ Chuột → CO₂ → Môi trường

> ✓ Chuột → Chất cặn bã → Môi trường

> ✓ Chuột → Nước tiểu → Môi trường

---

# **60\. NÚT XEM LẠI**

Sau khi hoàn thành có thể có nút:

> **XEM LẠI TƯƠNG TÁC**

Khi nhấn, hệ thống lần lượt phát lại:

1. O₂ đi vào.  
2. CO₂ đi ra.  
3. Nước đi vào.  
4. Thức ăn đi vào.  
5. Chất cặn bã đi ra.  
6. Nước tiểu đi ra.

Có thể cho phép:

> **DỪNG / TIẾP TỤC / XEM LẠI**

---

# **61\. TRẢI NGHIỆM NGƯỜI DÙNG HOÀN CHỈNH**

Luồng tổng thể:

MỞ THÍ NGHIỆM  
        ↓  
CHUỘT ĐANG Ở KHAY  
        ↓  
KÉO CHUỘT LÊN BÀN  
        ↓  
ĐÃ ĐẶT CHUỘT  
        ↓  
MỞ 2 NỘI DUNG  
        ↓  
 ┌───────────────┬─────────────────────────┐  
 ↓                                         ↓  
TRAO ĐỔI KHÍ                    TRAO ĐỔI NƯỚC,  
                                THỨC ĂN VÀ  
                                CHẤT THẢI  
 ↓                                         ↓  
HÔ HẤP                              THỨC ĂN  
 ↓                                         ↓  
O₂ VÀO                              NƯỚC VÀO  
 ↓                                         ↓  
CO₂ RA                               CHẤT CẶN BÃ RA  
 ↓                                         ↓  
HOÀN THÀNH                          NƯỚC TIỂU RA  
 └───────────────┬─────────────────────────┘  
                 ↓  
          KẾT QUẢ TỔNG HỢP  
                 ↓  
             KẾT LUẬN  
                 ↓  
       THÍ NGHIỆM HOÀN THÀNH

---

# **62\. LOGIC TỔNG THỂ DẠNG STATE MACHINE**

STATE\_0\_INITIAL  
        ↓  
STATE\_1\_MOUSE\_PLACED  
        ↓  
STATE\_2\_CONTENT\_SELECTION

        ├──────────────→ AIR\_EXCHANGE  
        │                     ↓  
        │                RESPIRATION  
        │                     ↓  
        │                 O2\_IN  
        │                     ↓  
        │                CO2\_OUT  
        │                     ↓  
        │              AIR\_COMPLETED  
        │  
        └──────────────→ WATER\_FOOD\_WASTE  
                              ↓  
                           FOOD\_IN  
                              ↓  
                           WATER\_IN  
                              ↓  
                           WASTE\_OUT  
                              ↓  
                           URINE\_OUT  
                              ↓  
                     WATER\_FOOD\_COMPLETED

                 ↓  
       BOTH CONTENT COMPLETED  
                 ↓  
       FINAL\_RESULT  
                 ↓  
      CONCLUSION / COMPLETE

---

# **63\. QUY TẮC QUAN TRỌNG CHO DEV**

### **Quy tắc 1**

Không cho phép thao tác nội dung khi chuột chưa được đặt.

### **Quy tắc 2**

Hai nội dung chính không phụ thuộc thứ tự.

### **Quy tắc 3**

Trong TRAO ĐỔI KHÍ chỉ có:

> **HÔ HẤP**

Không có quang hợp.

### **Quy tắc 4**

O₂ phải hoàn thành trước khi mở thao tác CO₂.

### **Quy tắc 5**

Thức ăn phải hoàn thành trước khi mở nước.

### **Quy tắc 6**

Nước phải hoàn thành trước khi mở chất cặn bã.

### **Quy tắc 7**

Chất cặn bã phải hoàn thành trước khi mở nước tiểu.

### **Quy tắc 8**

Sai thao tác không làm thay đổi state.

### **Quy tắc 9**

Vật thể kéo sai phải quay về vị trí ban đầu.

### **Quy tắc 10**

Làm lại phải reset toàn bộ state và animation.

### **Quy tắc 11**

Không được mất dữ liệu khi học sinh chỉ mở bảng thông tin.

### **Quy tắc 12**

Kết quả cuối chỉ xuất hiện khi hai nội dung chính đều hoàn thành.

---

# **64\. DANH SÁCH STATE HOÀN CHỈNH**

Có thể sử dụng:

mousePlaced \= false

airExchangeOpened \= false  
respirationOpened \= false

oxygenIn \= false  
carbonDioxideOut \= false

airExchangeCompleted \= false

waterFoodWasteOpened \= false

foodIn \= false  
waterIn \= false  
wasteOut \= false  
urineOut \= false

waterFoodWasteCompleted \= false

experimentCompleted \= false

currentStep \= "MOUSE"

---

# **65\. LOGIC RESET**

Khi chọn:

> **LÀM LẠI**

đặt:

mousePlaced \= false

airExchangeOpened \= false  
respirationOpened \= false

oxygenIn \= false  
carbonDioxideOut \= false

airExchangeCompleted \= false

waterFoodWasteOpened \= false

foodIn \= false  
waterIn \= false  
wasteOut \= false  
urineOut \= false

waterFoodWasteCompleted \= false

experimentCompleted \= false

currentStep \= "MOUSE"

Đồng thời reset:

mousePosition  
foodPosition  
waterPosition

oxygenParticles  
carbonDioxideParticles  
wasteObjects  
urineObjects

cameraMode  
zoomMode

allAnimations  
allHighlights  
allFeedbackMessages  
allOpenedInformationPanels

---

# **66\. NGUYÊN TẮC THIẾT KẾ HÌNH ẢNH**

Toàn bộ mô hình nên thống nhất phong cách:

* 3D.  
* Chân thật vừa phải.  
* Màu sắc sáng.  
* Không gian sạch.  
* Không gây sợ hãi.  
* Dễ nhận biết.  
* Phù hợp học sinh tiểu học.

Chuột cần có biểu cảm và animation tự nhiên nhưng không được hoạt hình hóa quá mức.

---

# **67\. NGUYÊN TẮC THIẾT KẾ UI**

Các nút chính phải:

* To.  
* Dễ đọc.  
* Tương phản tốt.  
* Có trạng thái khóa/mở rõ ràng.  
* Có trạng thái hover.  
* Có trạng thái đang chọn.  
* Có dấu ✓ khi hoàn thành.

Ví dụ:

> **TRAO ĐỔI KHÍ**

Khi khóa:

> Mờ \+ biểu tượng khóa.

Khi mở:

> Sáng \+ có thể nhấp.

Khi hoàn thành:

> **TRAO ĐỔI KHÍ ✓**

---

# **68\. NGUYÊN TẮC HIỂN THỊ HƯỚNG DẪN**

Mỗi thời điểm chỉ nên tập trung vào nhiệm vụ hiện tại.

Ví dụ:

Hãy kéo khí O₂ từ môi trường vào cơ thể chuột.

Sau khi hoàn thành:

Chính xác\! Chuột lấy khí O₂ từ môi trường để hô hấp.

Sau đó mới chuyển:

Chuột thải khí nào ra môi trường khi hô hấp?

Điều này giúp học sinh không bị quá tải thông tin.

---

# **69\. NGUYÊN TẮC KIẾN THỨC**

Kiến thức không nên xuất hiện toàn bộ ngay từ đầu.

Thay vào đó:

> **HỌC SINH THAO TÁC**

↓

> **HỆ THỐNG HIỂN THỊ HIỆN TƯỢNG**

↓

> **HỆ THỐNG GIẢI THÍCH**

↓

> **HỌC SINH RÚT RA KẾT LUẬN**

Ví dụ:

Học sinh kéo O₂ vào chuột.

↓

O₂ đi vào phổi.

↓

Hiển thị:

> **Chính xác\! Chuột lấy khí O₂ từ môi trường để hô hấp.**

Cách này giúp kiến thức gắn trực tiếp với hành động.

---

# **70\. KẾT LUẬN CUỐI CÙNG CỦA THÍ NGHIỆM**

Màn hình cuối cùng hiển thị nổi bật:

> **Động vật thường xuyên trao đổi chất với môi trường. Chúng lấy khí O₂, nước và thức ăn từ môi trường để duy trì sự sống và hoạt động. Sau đó, cơ thể thải khí CO₂, chất cặn bã và nước tiểu ra môi trường.**

Bên dưới có sơ đồ:

MÔI TRƯỜNG  
    ↓  
O₂ \+ NƯỚC \+ THỨC ĂN  
    ↓  
CHUỘT BẠCH  
    ↓  
CO₂ \+ CHẤT CẶN BÃ \+ NƯỚC TIỂU  
    ↓  
MÔI TRƯỜNG

---

# **71\. TIÊU CHÍ HOÀN THÀNH WEB**

Web được xem là hoàn thành yêu cầu khi học sinh có thể:

1. Đặt chuột lên bàn.  
2. Mở TRAO ĐỔI KHÍ.  
3. Quan sát hô hấp.  
4. Kéo O₂ vào đúng.  
5. Kéo CO₂ ra đúng.  
6. Hoàn thành TRAO ĐỔI KHÍ.  
7. Mở TRAO ĐỔI NƯỚC, THỨC ĂN VÀ CHẤT THẢI.  
8. Đưa thức ăn vào đúng.  
9. Đưa nước vào đúng.  
10. Xác định chất cặn bã được thải ra.  
11. Đưa nước tiểu ra ngoài.  
12. Hoàn thành nội dung thứ hai.  
13. Xem sơ đồ trao đổi tổng hợp.  
14. Đọc kết luận.  
15. Có thể làm lại thí nghiệm và bắt đầu lại hoàn toàn.

---

# **72\. TINH THẦN CHUNG CỦA SẢN PHẨM**

Đây không phải là một trang web chỉ để học sinh đọc:

> **“Động vật cần O₂, nước và thức ăn.”**

Mà phải là một trải nghiệm:

> **HỌC SINH TỰ TAY ĐƯA CÁC YẾU TỐ VÀO → QUAN SÁT CHUỘT SỬ DỤNG → QUAN SÁT CÁC CHẤT ĐƯỢC THẢI RA → NHÌN THẤY DÒNG TRAO ĐỔI → TỰ HÌNH THÀNH KIẾN THỨC.**

Toàn bộ web cần ưu tiên:

> **3D → KÉO THẢ → CAMERA → ANIMATION → PHẢN HỒI NGAY → SƠ ĐỒ TRAO ĐỔI → KẾT LUẬN**

Và nguyên tắc cốt lõi của toàn bộ thí nghiệm là:

> **MÔI TRƯỜNG → CƠ THỂ ĐỘNG VẬT → MÔI TRƯỜNG**

Trong đó:

> **MÔI TRƯỜNG → O₂ → CHUỘT**

> **MÔI TRƯỜNG → NƯỚC → CHUỘT**

> **MÔI TRƯỜNG → THỨC ĂN → CHUỘT**

và:

> **CHUỘT → CO₂ → MÔI TRƯỜNG**

> **CHUỘT → CHẤT CẶN BÃ → MÔI TRƯỜNG**

> **CHUỘT → NƯỚC TIỂU → MÔI TRƯỜNG**

Đây là cấu trúc kiến thức và tương tác trung tâm mà toàn bộ giao diện, animation và logic lập trình cần xoay quanh.

# THÍ NGHIỆM 5

# **ĐẶC TẢ CHI TIẾT WEB THÍ NGHIỆM 5**

## **TÌM HIỂU CƠ QUAN SINH SẢN CỦA THỰC VẬT CÓ HOA VÀ QUÁ TRÌNH TẠO QUẢ, HẠT Ở CÂY CÀ CHUA**

---

# **I. MỤC ĐÍCH CỦA THÍ NGHIỆM**

Thiết kế một thí nghiệm tương tác 3D dành cho học sinh tiểu học nhằm giúp học sinh quan sát và thực hiện theo trình tự:

**Cấu tạo hoa → Nhị → Nhụy → Lấy hạt phấn → Thụ phấn → Hạt phấn nảy mầm → Ống phấn → Noãn → Thụ tinh → Bầu nhụy phát triển thành quả → Noãn phát triển thành hạt → Quả chín có hạt.**

Học sinh không chỉ quan sát mà phải trực tiếp:

* kéo – thả hoa;  
* sử dụng kính lúp;  
* quan sát cấu tạo bên trong hoa;  
* xác định nhị;  
* xác định nhụy;  
* xác định chỉ nhị và bao phấn;  
* quan sát hạt phấn;  
* sử dụng que lấy phấn;  
* lấy hạt phấn từ bao phấn;  
* đưa hạt phấn đến đầu nhụy;  
* thực hiện thụ phấn;  
* kích hoạt quá trình hạt phấn nảy mầm;  
* điều khiển ống phấn đi qua vòi nhụy;  
* đưa ống phấn đến noãn;  
* đưa tế bào sinh dục đực vào noãn;  
* quan sát thụ tinh;  
* theo dõi quá trình hình thành quả;  
* quan sát quá trình noãn phát triển thành hạt;  
* theo dõi quả xanh phát triển thành quả chín;  
* quan sát các hạt bên trong quả cà chua chín.

---

# **II. NGUYÊN TẮC THIẾT KẾ CHUNG**

## **1\. Phong cách hình ảnh**

Toàn bộ thí nghiệm sử dụng phong cách:

* 3D;  
* trực quan;  
* chân thật;  
* phù hợp với học sinh tiểu học;  
* màu sắc rõ ràng;  
* vật thể có chiều sâu;  
* không sử dụng hình minh họa 2D đơn giản thay cho vật thể chính.

Các bộ phận sinh sản của hoa phải được thể hiện đúng vị trí tương đối trong hoa.

---

## **2\. Nguyên tắc tương tác**

Học sinh phải trực tiếp thao tác với vật thể.

Các thao tác chính:

* CLICK;  
* DRAG;  
* DROP;  
* HOVER;  
* ZOOM;  
* quan sát;  
* kéo đối tượng theo đường dẫn;  
* nhấp vào vùng tương tác.

Không cho phép học sinh bỏ qua các bước bắt buộc.

---

# **III. BỐ CỤC GIAO DIỆN TỔNG THỂ**

Màn hình thí nghiệm gồm 3 khu vực chính:

## **1\. Khu vực bên trái**

Là:

**KHAY DỤNG CỤ THÍ NGHIỆM**

Khay được cố định ở bên trái màn hình.

Trong khay gồm:

1. Hoa cà chua.  
2. Kính lúp 3D.  
3. Que lấy phấn.

Học sinh phải kéo trực tiếp vật dụng từ khay bên trái lên bàn thí nghiệm ở giữa.

---

## **2\. Khu vực trung tâm**

Là:

**BÀN THÍ NGHIỆM**

Bàn bằng gỗ, đặt trong bối cảnh sân vườn.

Trên bàn là khu vực chính để học sinh thực hiện toàn bộ thí nghiệm.

---

## **3\. Khu vực phía trên**

Hiển thị:

**THANH TIẾN TRÌNH**

Thanh tiến trình:

**Cấu tạo hoa → Thụ phấn → Thụ tinh → Quả → Hạt → Cây con**

Mỗi bước có một trạng thái:

* Chưa thực hiện;  
* Đang thực hiện;  
* Đã hoàn thành.

Khi học sinh hoàn thành từng bước, bước tương ứng được sáng lên.

Các bước chưa được mở phải ở trạng thái khóa.

---

## **4\. Góc dưới bên phải**

Luôn hiển thị nút:

**LÀM LẠI THÍ NGHIỆM**

Nút phải:

* đủ lớn;  
* dễ nhìn;  
* dễ nhấp;  
* phù hợp với học sinh tiểu học.

---

# **IV. NÚT “LÀM lại thí nghiệm”**

## **1\. Trạng thái ban đầu**

Nút:

**LÀM LẠI THÍ NGHIỆM**

luôn hiển thị ở góc dưới bên phải.

---

## **2\. Khi học sinh nhấp nút**

Hiển thị hộp thoại xác nhận:

> **“Em có chắc muốn làm lại thí nghiệm không?”**

Bên dưới có 2 nút:

**HỦY | LÀM LẠI**

---

## **3\. Nếu chọn HỦY**

Hệ thống:

1. Đóng hộp thoại.  
2. Giữ nguyên toàn bộ tiến trình hiện tại.  
3. Không thay đổi vật thể.  
4. Không xóa kết quả.  
5. Không dừng tiến trình đang thực hiện.

---

## **4\. Nếu chọn LÀM LẠI**

Hệ thống phải reset toàn bộ thí nghiệm.

Thực hiện lần lượt:

1. Xóa toàn bộ kết quả của lần thí nghiệm trước.  
2. Dừng mọi hiệu ứng đang chạy.  
3. Đưa thời gian về **Ngày 0**.  
4. Đưa hoa cà chua về trạng thái ban đầu.  
5. Xóa toàn bộ hạt phấn đã được lấy.  
6. Xóa hạt phấn đang nằm trên đầu nhụy.  
7. Xóa ống phấn.  
8. Hủy trạng thái **đã thụ phấn**.  
9. Hủy trạng thái **đã thụ tinh**.  
10. Xóa quả cà chua đã hình thành.  
11. Xóa hạt đã hình thành.  
12. Đưa tất cả dụng cụ về khay vật liệu bên trái.  
13. Đưa bàn thí nghiệm về trạng thái trống.  
14. Đưa thanh tiến trình về bước đầu tiên:

**Cấu tạo hoa**

15. Khóa lại toàn bộ các bước chưa được thực hiện.  
16. Đưa hệ thống về đúng trạng thái ban đầu.

---

# **V. KHAY DỤNG CỤ BÊN TRÁI**

## **1\. Hoa cà chua**

Khay có:

**1 bông hoa cà chua đang nở.**

Hoa chưa tạo quả.

### **Đặc điểm bắt buộc**

Hoa phải:

* màu vàng;  
* có 5 cánh hoa;  
* cánh hoa có hình dáng giống hoa cà chua thật;  
* ở chính giữa có các cơ quan sinh sản;  
* được dựng 3D;  
* có chiều sâu;  
* có tỷ lệ tương đối hợp lý;  
* không được làm đơn giản như biểu tượng 2D.

Khi nhìn từ trên xuống:

* thấy được các cánh hoa;  
* thấy phần trung tâm.

Khi chuyển sang chế độ quan sát bên trong:

* thấy được nhị;  
* thấy được nhụy;  
* thấy được các bộ phận bên trong.

---

# **VI. ĐẶT HOA LÊN BÀN**

Học sinh phải:

**Kéo hoa cà chua từ khay bên trái → thả lên bàn thí nghiệm.**

Khi thả thành công:

* hoa đứng cố định tại vị trí được thả;  
* hệ thống ghi nhận trạng thái **ĐÃ ĐẶT HOA**;  
* bước **Cấu tạo hoa** được mở.

Nếu học sinh chưa đặt hoa mà cố sử dụng dụng cụ khác:

Ví dụ:

* kéo kính lúp;  
* kéo que lấy phấn.

Hệ thống phải:

1. Không cho thực hiện thao tác.  
2. Vật dụng tự động quay trở lại khay.  
3. Hiển thị thông báo:

> **“Hãy đặt hoa cà chua lên bàn trước.”**

---

# **VII. BẢNG THÔNG TIN CỦA HOA**

Khi học sinh nhấp vào bông hoa, hiển thị bảng thông tin bên cạnh.

## **Nội dung bảng**

| Thông tin | Hoa A |
| ----- | ----- |
| Loài | Cà chua |
| Giai đoạn | Đang nở hoa |
| Màu hoa | Vàng |
| Trạng thái | Khỏe mạnh |
| Nhị | Có |
| Nhụy | Có |

Bảng có thể đóng bằng nút **X**.

---

# **VIII. KÍNH LÚP 3D**

Trong khay bên trái có:

**1 KÍNH LÚP 3D**

Mục đích:

* phóng đại hoa;  
* giúp học sinh nhìn rõ cấu tạo hoa;  
* hỗ trợ thao tác quan sát.

---

## **Khi học sinh kéo kính lúp đến gần hoa**

Vùng hoa nằm dưới kính phải:

* được phóng đại;  
* hiển thị rõ hơn;  
* làm nổi bật các bộ phận bên trong.

Sau khi kính lúp được đặt đúng vị trí, xuất hiện nút:

**QUAN SÁT CẤU TẠO HOA**

---

# **IX. CHẾ ĐỘ QUAN SÁT CẤU TẠO HOA**

Khi học sinh nhấp:

**QUAN SÁT CẤU TẠO HOA**

hệ thống chuyển sang:

**CHẾ ĐỘ QUAN SÁT CẮT DỌC 3D**

---

## **1\. Hiển thị hoa**

Bông hoa được cắt dọc theo chiều đứng thành hai phần.

### **Phần thứ nhất**

Giữ hình ảnh 3D bình thường.

### **Phần thứ hai**

Được làm:

* trong suốt;  
* hoặc bán trong suốt.

Mục đích để học sinh nhìn thấy cấu tạo bên trong.

Các bộ phận phải:

* đúng vị trí sinh học;  
* vẫn gắn với hoa;  
* không được tách rời thành các mảnh riêng biệt.

---

# **X. ĐIỂM TƯƠNG TÁC TRÊN CÁC BỘ PHẬN**

Trên mô hình hoa xuất hiện các điểm tương tác nhỏ.

Mỗi điểm nằm cạnh một bộ phận.

---

## **Khi học sinh chưa nhấp**

Không hiển thị tên bộ phận.

Chỉ hiển thị:

* dấu chấm;  
* hoặc biểu tượng tương tác nhỏ.

Khi đưa chuột đến đúng vị trí:

* điểm tương tác sáng lên;  
* bộ phận tương ứng được viền sáng nhẹ.

---

## **Khi học sinh nhấp vào bộ phận**

Hệ thống:

1. Tô sáng bộ phận.  
2. Làm nổi bật bộ phận.  
3. Hiển thị nhãn tên ngay bên cạnh.

---

# **XI. QUAN SÁT NHỊ**

Khi học sinh nhấp vào:

**NHỊ**

hệ thống phóng to khu vực nhị.

Hiển thị nhãn:

**NHỊ**

Sau đó đánh dấu hai thành phần:

1. Chỉ nhị.  
2. Bao phấn.

---

## **1\. Chỉ nhị**

Hiển thị phần giống một cuống nhỏ.

Khi học sinh nhấp:

* chỉ nhị được tô sáng;  
* xuất hiện nhãn **CHỈ NHỊ**.

---

## **2\. Bao phấn**

Là phần nằm ở đầu chỉ nhị.

Bao phấn phải chứa nhiều hạt phấn.

Khi học sinh nhấp vào:

**BAO PHẤN**

Hệ thống:

1. Phóng to bao phấn.  
2. Làm nổi bật các hạt phấn.  
3. Hiển thị thông báo:

> **“Bao phấn chứa và tạo ra hạt phấn.”**

---

# **XII. QUAN SÁT NHỤY**

Khi học sinh nhấp:

**NHỤY**

hệ thống phóng to khu vực nhụy.

Làm nổi bật đường đi:

**Đầu nhụy → Vòi nhụy → Bầu nhụy**

---

## **1\. Đầu nhụy**

Hiển thị nhãn:

**ĐẦU NHỤY**

Mô tả:

Là phần ở trên cùng của nhụy.

---

## **2\. Vòi nhụy**

Hiển thị nhãn:

**VÒI NHỤY**

Mô tả:

Là phần nối đầu nhụy với bầu nhụy.

---

## **3\. Bầu nhụy**

Hiển thị nhãn:

**BẦU NHỤY**

Mô tả:

Là phần nằm phía dưới của nhụy.

Khi học sinh nhấp vào bầu nhụy:

* chuyển sang chế độ nhìn xuyên;  
* hiển thị các noãn bên trong;  
* gắn nhãn:

**NOÃN**

---

# **XIII. MỞ KHÓA THAO TÁC THỤ PHẤN**

Chỉ sau khi học sinh đã quan sát:

* nhị;  
* nhụy;

hệ thống mới mở nút:

**THỰC HIỆN THỤ PHẤN**

Nếu chưa hoàn thành quan sát:

* nút bị khóa;  
* không thể nhấp.

---

# **XIV. CHUYỂN SANG CHẾ ĐỘ THỤ PHẤN**

Khi học sinh nhấp:

**THỰC HIỆN THỤ PHẤN**

Hệ thống:

1. Sử dụng chính bông hoa cà chua ban đầu.  
2. Đưa hoa trở lại trạng thái nhìn bên ngoài 3D.  
3. Không còn cắt đôi hoa.  
4. Phóng to bông hoa để dễ thao tác.  
5. Giữ nhị và nhụy ở vị trí tự nhiên.  
6. Làm nổi bật nhẹ **bao phấn**.  
7. Đánh dấu **đầu nhụy** bằng một vòng sáng nhẹ.

---

# **XV. QUE LẤY PHẤN**

Trong khay bên trái có:

**1 QUE LẤY PHẤN NHỎ**

Đặc điểm:

* dạng que mảnh;  
* đầu que có thể lấy một lượng nhỏ hạt phấn.

---

# **XVI. BƯỚC LẤY HẠT PHẤN**

Học sinh kéo:

**QUE LẤY PHẤN → BAO PHẤN**

---

## **Nếu thao tác đúng**

Khi que chạm đúng bao phấn:

1. Bao phấn rung nhẹ.  
2. Một số hạt phấn rơi ra.  
3. Một phần hạt phấn bám vào đầu que.  
4. Hệ thống hiển thị:

> **“Đã lấy hạt phấn từ bao phấn.”**

Trạng thái:

**QUE\_HAS\_POLLEN \= TRUE**

---

## **Nếu thao tác sai**

Nếu học sinh đưa que đến:

* cánh hoa;  
* thân;  
* vùng không phải bao phấn;

thì:

* không lấy được phấn;  
* que không nhận hạt phấn.

Thông báo:

> **“Hãy đưa que đến bao phấn để lấy hạt phấn.”**

---

# **XVII. ĐƯA HẠT PHẤN ĐẾN ĐẦU NHỤY**

Sau khi que đã có hạt phấn:

Học sinh kéo:

**QUE CÓ HẠT PHẤN → ĐẦU NHỤY**

---

## **Nếu đúng**

Khi hạt phấn chạm đúng đầu nhụy:

1. Hạt phấn rơi khỏi que.  
2. Các hạt phấn bám lên đầu nhụy.  
3. Đầu nhụy phát sáng nhẹ.  
4. Phát âm thanh:

**“ting”**

5. Hiển thị:

> **“Thụ phấn đã xảy ra.”**

Sau đó hiển thị giải thích:

> **“Thụ phấn là quá trình hạt phấn được chuyển từ bao phấn đến đầu nhụy.”**

Trạng thái:

**POLLINATION \= TRUE**

Bước:

**THỤ PHẤN**

được đánh dấu hoàn thành.

---

# **XVIII. XỬ LÝ THAO TÁC THỤ PHẤN SAI**

## **Trường hợp 1: Đưa hạt phấn vào cánh hoa**

Kết quả:

* hạt phấn rơi xuống;  
* không xảy ra thụ phấn.

Thông báo:

> **“Hãy đưa hạt phấn đến đầu nhụy.”**

---

## **Trường hợp 2: Đưa hạt phấn vào vòi nhụy**

Không kích hoạt thụ phấn.

Thông báo:

> **“Hãy đưa hạt phấn đến đầu nhụy.”**

---

## **Trường hợp 3: Đưa hạt phấn vào bầu nhụy**

Không cho phép thao tác.

Hạt phấn:

* tự động quay lại vị trí ban đầu;  
* không kích hoạt thụ phấn.

---

# **XIX. CHUYỂN SANG QUÁ TRÌNH THỤ TINH**

Sau khi thụ phấn xảy ra, hệ thống chuyển sang:

**CHẾ ĐỘ QUAN SÁT CẮT DỌC 3D**

---

## **Mô hình hiển thị**

1. Một nửa bông hoa được làm trong suốt.  
2. Camera tự động phóng to vùng:  
   * đầu nhụy;  
   * vòi nhụy;  
   * bầu nhụy.  
3. Bên trong bầu nhụy hiển thị rõ các noãn.  
4. Hạt phấn đã nằm trên đầu nhụy vẫn được giữ nguyên.

---

## **Hướng dẫn**

Hiển thị:

> **“Hãy quan sát và thực hiện quá trình đưa tế bào sinh dục đực đến noãn.”**

---

# **XX. HẠT PHẤN NẢY MẦM**

Học sinh phải nhấp vào:

**HẠT PHẤN ĐANG NẰM TRÊN ĐẦU NHỤY**

---

## **Khi nhấp đúng**

Hệ thống:

1. Phóng to hạt phấn.  
2. Hạt phấn bắt đầu nảy mầm.  
3. Một ống nhỏ phát triển từ hạt phấn.

Hiển thị:

> **“Hạt phấn nảy mầm và hình thành ống phấn.”**

Trạng thái:

**POLLEN\_GERMINATED \= TRUE**

---

## **Khi nhấp sai**

Nếu học sinh nhấp vào vị trí khác:

Hiển thị:

> **“Hãy nhấp vào hạt phấn trên đầu nhụy.”**

Không xảy ra hiệu ứng.

---

# **XXI. ỐNG PHẤN PHÁT TRIỂN**

Sau khi hạt phấn nảy mầm, học sinh phải điều khiển ống phấn.

Hiển thị hướng dẫn:

> **“Kéo ống phấn đi qua vòi nhụy xuống bầu nhụy.”**

Học sinh dùng chuột:

**KÉO ĐẦU ỐNG PHẤN XUỐNG DƯỚI**

---

## **Đường đi bắt buộc**

Ống phấn phải đi theo thứ tự:

**Đầu nhụy → Vòi nhụy → Bầu nhụy**

---

## **Khi kéo đúng**

Trong quá trình kéo:

1. Ống phấn dài dần.  
2. Camera di chuyển theo ống phấn.  
3. Ống phấn đi xuyên qua vòi nhụy.  
4. Tiếp tục đi xuống bầu nhụy.

---

## **Khi kéo sai hướng**

Hiển thị:

> **“Hãy đưa ống phấn đi xuống qua vòi nhụy.”**

Ống phấn tự động quay lại vị trí gần nhất.

---

# **XXII. ĐƯA ỐNG PHẤN ĐẾN NOÃN**

Khi ống phấn đến bầu nhụy:

* các noãn được hiển thị rõ;  
* camera tập trung vào khu vực noãn.

Hiển thị:

> **“Đưa đầu ống phấn đến một noãn.”**

Học sinh kéo đầu ống phấn đến đúng vị trí của một noãn.

---

## **Khi chạm đúng noãn**

1. Noãn sáng lên.  
2. Ống phấn kết nối với noãn.  
3. Hiển thị:

> **“Ống phấn đã đến noãn.”**

---

## **Khi kéo sai**

Hiển thị:

> **“Hãy đưa đầu ống phấn đến một noãn.”**

Ống phấn tự động quay lại vị trí gần nhất.

---

# **XXIII. ĐƯA TẾ BÀO SINH DỤC ĐỰC VÀO NOÃN**

Sau khi ống phấn kết nối với noãn:

Một chấm sáng nhỏ xuất hiện ở đầu ống phấn.

Hiển thị:

> **“Kéo tế bào sinh dục đực vào bên trong noãn.”**

Học sinh dùng chuột kéo chấm sáng:

**ĐẦU ỐNG PHẤN → BÊN TRONG NOÃN**

---

## **Khi kéo đúng**

Tế bào sinh dục đực:

1. di chuyển theo ống phấn;  
2. đi vào bên trong noãn;  
3. xuất hiện tế bào sinh dục cái.

---

## **Khi kéo sai**

Hiển thị:

> **“Hãy đưa tế bào sinh dục đực theo ống phấn vào bên trong noãn.”**

Tế bào sinh dục đực tự động quay lại đầu ống phấn.

---

# **XXIV. THỤ TINH XẢY RA**

Khi tế bào sinh dục đực chạm vào tế bào sinh dục cái:

1. Hai tế bào tiến lại gần nhau.  
2. Hai tế bào kết hợp thành một.  
3. Xuất hiện hiệu ứng sáng nhẹ.  
4. Hệ thống dừng chuyển động khoảng 2 giây.

Sau đó hiển thị chữ lớn:

> **THỤ TINH ĐÃ XẢY RA**

Tiếp theo hiển thị:

> **“Tế bào sinh dục đực kết hợp với tế bào sinh dục cái trong noãn.”**

Trạng thái:

**FERTILIZATION \= TRUE**

Thanh tiến trình mở bước:

**QUẢ**

và

**HẠT**

---

# **XXV. BẮT ĐẦU QUAN SÁT SỰ TẠO QUẢ VÀ HẠT**

Sau khi thụ tinh hoàn thành, xuất hiện nút:

**BẮT ĐẦU QUAN SÁT SỰ TẠO QUẢ VÀ HẠT**

Học sinh nhấp vào nút.

Hệ thống bắt đầu:

**TUA NHANH THỜI GIAN**

---

# **XXVI. THANH THỜI GIAN**

Hiển thị:

**Ngày 0 → Ngày 3 → Ngày 7 → Ngày 14 → Ngày 21 → Ngày 30**

Thời gian phải được thể hiện trực quan.

Có thể sử dụng:

* thanh thời gian;  
* mốc ngày;  
* hiệu ứng tua nhanh;  
* trạng thái dừng tại các mốc quan trọng.

---

# **XXVII. NGÀY 0 – NGÀY 3**

## **1\. Cánh hoa**

Cánh hoa bắt đầu:

* héo;  
* cụp xuống;  
* rụng dần.

---

## **2\. Bầu nhụy**

Bầu nhụy:

* bắt đầu phình to;  
* kích thước tăng dần.

---

## **3\. Noãn**

Noãn:

* tiếp tục phát triển;  
* vẫn nằm bên trong bầu nhụy.

---

# **XXVIII. NGÀY 7 – TẠO QUẢ**

Khi thời gian đến:

**Ngày 7**

Hệ thống tạm dừng.

Mục đích:

**Cho học sinh quan sát sự hình thành quả.**

---

## **Hiệu ứng**

Bầu nhụy:

* phình to rõ rệt;  
* thay đổi hình dạng;  
* chuyển thành quả cà chua non màu xanh.

Trước khi chuyển đổi hoàn toàn:

* phần bầu nhụy được làm nổi bật.

Xuất hiện mũi tên:

**BẦU NHỤY → QUẢ**

Hiển thị:

> **“Sau khi thụ tinh, bầu nhụy phát triển thành quả.”**

Sau khi học sinh quan sát, hệ thống tiếp tục tua nhanh.

---

# **XXIX. NGÀY 14 – NOÃN PHÁT TRIỂN THÀNH HẠT**

Khi đến khoảng:

**Ngày 14**

Quả vẫn phải:

**MÀU XANH**

Không được chuyển đỏ ở bước này.

---

## **Hướng dẫn**

Hiển thị:

> **“Nhấp vào quả để quan sát bên trong.”**

Học sinh nhấp vào quả.

---

# **XXX. QUAN SÁT BÊN TRONG QUẢ XANH**

Quả chuyển sang:

**CHẾ ĐỘ CẮT DỌC 3D**

Bên trong quả xuất hiện các cấu trúc nhỏ được đánh dấu:

**NOÃN**

---

## **Hiệu ứng biến đổi**

Hệ thống bắt đầu mô phỏng:

**Noãn → lớn dần → hình thành hạt**

Các noãn lần lượt biến đổi thành:

**HẠT CÀ CHUA NHỎ MÀU VÀNG NHẠT**

Hiển thị:

> **“Sau khi thụ tinh, noãn phát triển thành hạt.”**

---

## **Yêu cầu bắt buộc**

Ở giai đoạn này:

* quả vẫn phải là quả xanh;  
* không được chuyển đỏ;  
* học sinh phải nhìn thấy quá trình noãn biến đổi thành hạt;  
* hạt phải nằm bên trong quả.

---

# **XXXI. QUẢ TIẾP TỤC PHÁT TRIỂN**

Sau khi quan sát quá trình tạo hạt:

Hệ thống tiếp tục tua nhanh:

**Ngày 14 → Ngày 21 → Ngày 30**

---

## **Quá trình biến đổi**

**Quả xanh → lớn dần → chuyển vàng → đỏ → quả chín**

Trong quá trình này:

* quả tăng kích thước;  
* màu sắc thay đổi dần;  
* hạt bên trong tiếp tục hoàn thiện.

---

# **XXXII. NGÀY 30 – QUẢ CÀ CHUA CHÍN**

Khi đến:

**Ngày 30**

Quả trở thành:

**QUẢ CÀ CHUA CHÍN ĐỎ**

Hệ thống dừng lại.

Hiển thị:

> **“Quả cà chua đã chín. Nhấp vào quả để quan sát các hạt bên trong.”**

---

# **XXXIII. QUAN SÁT QUẢ CHÍN**

Học sinh nhấp vào quả.

Quả tự động:

**CẮT ĐÔI**

Hệ thống phóng đại phần bên trong.

---

## **Học sinh nhìn thấy**

1. Thịt quả.  
2. Phần dịch nhầy.  
3. Nhiều hạt cà chua màu vàng nhạt.  
4. Các hạt nằm bên trong quả.

Một hạt được phóng đại để học sinh dễ quan sát.

Hiển thị:

> **“Quả cà chua chứa nhiều hạt.”**

---

# **XXXIV. THANH TIẾN TRÌNH HOÀN THÀNH**

Sau khi học sinh hoàn thành quan sát quả chín:

Thanh tiến trình hiển thị đầy đủ:

**Cấu tạo hoa → Thụ phấn → Thụ tinh → Quả → Hạt → Cây con**

Các bước đã thực hiện được đánh dấu hoàn thành.

Bước chưa có thao tác thực tế tiếp theo vẫn ở trạng thái khóa.

---

# **XXXV. LOGIC TOÀN BỘ THÍ NGHIỆM**

Web phải ghi nhận trạng thái của từng bước.

Trình tự bắt buộc:

**ĐẶT HOA**

↓

**QUAN SÁT CẤU TẠO**

↓

**XÁC ĐỊNH NHỊ**

↓

**XÁC ĐỊNH NHỤY**

↓

**QUAN SÁT CHỈ NHỊ**

↓

**QUAN SÁT BAO PHẤN**

↓

**QUAN SÁT ĐẦU NHỤY**

↓

**QUAN SÁT VÒI NHỤY**

↓

**QUAN SÁT BẦU NHỤY**

↓

**QUAN SÁT NOÃN**

↓

**LẤY HẠT PHẤN TỪ BAO PHẤN**

↓

**ĐƯA HẠT PHẤN ĐẾN ĐẦU NHỤY**

↓

**THỤ PHẤN**

↓

**HẠT PHẤN NẢY MẦM**

↓

**ỐNG PHẤN PHÁT TRIỂN**

↓

**ỐNG PHẤN ĐI QUA VÒI NHỤY**

↓

**ỐNG PHẤN ĐẾN NOÃN**

↓

**ĐƯA TẾ BÀO SINH DỤC ĐỰC VÀO NOÃN**

↓

**THỤ TINH**

↓

**BẦU NHỤY PHÁT TRIỂN THÀNH QUẢ**

↓

**NOÃN PHÁT TRIỂN THÀNH HẠT**

↓

**QUẢ TIẾP TỤC PHÁT TRIỂN**

↓

**QUẢ CHÍN**

↓

**QUAN SÁT HẠT TRONG QUẢ**

↓

**HOÀN THÀNH**

---

# **XXXVI. LOGIC KHÓA / MỞ KHÓA**

## **Trạng thái 1 – Chưa có hoa**

Không được:

* quan sát;  
* sử dụng kính lúp;  
* sử dụng que lấy phấn.

---

## **Trạng thái 2 – Đã đặt hoa**

Được:

* nhấp vào hoa;  
* xem bảng thông tin;  
* kéo kính lúp.

Chưa được:

* lấy phấn.

---

## **Trạng thái 3 – Chưa quan sát cấu tạo**

Không mở:

**THỰC HIỆN THỤ PHẤN**

---

## **Trạng thái 4 – Đã quan sát nhị và nhụy**

Mở:

**THỰC HIỆN THỤ PHẤN**

---

## **Trạng thái 5 – Chưa lấy được phấn**

Không thể:

**Đưa phấn đến đầu nhụy**

---

## **Trạng thái 6 – Chưa đưa phấn đến đầu nhụy**

Không xảy ra:

**THỤ PHẤN**

---

## **Trạng thái 7 – Chưa thụ phấn**

Không kích hoạt:

**QUÁ TRÌNH THỤ TINH**

---

## **Trạng thái 8 – Chưa thụ tinh**

Không được:

**TẠO QUẢ VÀ HẠT**

---

## **Trạng thái 9 – Chưa tạo quả**

Không được xuất hiện:

**QUẢ CHÍN**

---

# **XXXVII. QUY TẮC KÉO – THẢ**

Mỗi vật thể chỉ được thả vào vùng hợp lệ.

## **Nếu đúng vị trí**

* vật thể được giữ lại;  
* kích hoạt bước tương ứng;  
* cập nhật trạng thái;  
* phát hiệu ứng phù hợp.

## **Nếu sai vị trí**

* vật thể quay về vị trí gần nhất hoặc vị trí ban đầu;  
* không làm thay đổi tiến trình;  
* hiển thị hướng dẫn.

---

# **XXXVIII. QUY TẮC PHẢN HỒI**

Mỗi thao tác đúng phải có phản hồi trực quan.

Có thể gồm:

* phát sáng;  
* rung nhẹ;  
* chuyển động;  
* âm thanh “ting”;  
* hiện thông báo;  
* thay đổi màu;  
* camera tự động tập trung.

Mỗi thao tác sai phải có phản hồi rõ ràng nhưng không gây cảm giác thất bại nặng nề.

Ví dụ:

> **“Hãy đưa hạt phấn đến đầu nhụy.”**

hoặc:

> **“Hãy đưa ống phấn đi xuống qua vòi nhụy.”**

---

# **XXXIX. CAMERA**

Camera phải tự động thay đổi theo từng giai đoạn.

## **Giai đoạn quan sát hoa**

Camera:

* nhìn từ trên;  
* cho phép quan sát cánh hoa;  
* thấy phần trung tâm.

## **Giai đoạn quan sát cấu tạo**

Camera:

* chuyển sang góc nhìn cắt dọc;  
* phóng to nhị và nhụy.

## **Giai đoạn thụ phấn**

Camera:

* phóng to hoa;  
* tập trung vào bao phấn và đầu nhụy.

## **Giai đoạn thụ tinh**

Camera:

* tập trung vào đầu nhụy;  
* đi xuống vòi nhụy;  
* theo dõi ống phấn;  
* phóng to bầu nhụy và noãn.

## **Giai đoạn tạo hạt**

Camera:

* chuyển vào bên trong quả;  
* phóng đại các noãn;  
* cho phép quan sát hạt hình thành.

---

# **XL. HIỆU ỨNG HÌNH ẢNH**

## **1\. Bao phấn**

Khi cần thao tác:

* sáng nhẹ;  
* có thể có vòng highlight.

## **2\. Đầu nhụy**

Khi cần nhận phấn:

* có vòng sáng nhẹ.

## **3\. Hạt phấn**

Có thể sử dụng:

* kích thước nhỏ;  
* màu dễ nhìn;  
* hiệu ứng phát sáng nhẹ khi được chọn.

## **4\. Ống phấn**

Phải nhìn thấy rõ quá trình:

**ngắn → dài dần → đi xuống → đến noãn.**

## **5\. Noãn**

Khi được chọn:

* sáng lên;  
* được phóng đại.

## **6\. Thụ tinh**

Có hiệu ứng:

* hai tế bào tiến lại;  
* kết hợp;  
* sáng nhẹ;  
* dừng khoảng 2 giây.

---

# **XLI. CẤU TRÚC TRẠNG THÁI CHO LẬP TRÌNH**

Có thể tổ chức trạng thái theo dạng:

**experimentState**

Bao gồm:

* flowerPlaced  
* flowerObserved  
* stamenObserved  
* pistilObserved  
* antherObserved  
* ovuleObserved  
* pollinationUnlocked  
* hasPollen  
* pollenOnStigma  
* pollinated  
* pollenGerminated  
* pollenTubeCreated  
* pollenTubeInStyle  
* pollenTubeReachedOvuIe  
* maleCellReleased  
* fertilized  
* fruitStarted  
* fruitFormed  
* seedFormationObserved  
* fruitRipening  
* ripeFruit  
* finalObservationComplete

---

# **XLII. LOGIC STATE MACHINE**

## **STATE 0**

**INITIAL**

Hoa nằm trong khay.

↓

## **STATE 1**

**FLOWER\_PLACED**

Hoa nằm trên bàn.

↓

## **STATE 2**

**FLOWER\_OBSERVATION**

Học sinh quan sát cấu tạo.

↓

## **STATE 3**

**REPRODUCTIVE\_ORGANS\_OBSERVED**

Đã quan sát nhị và nhụy.

↓

## **STATE 4**

**POLLINATION\_READY**

Mở thao tác thụ phấn.

↓

## **STATE 5**

**POLLEN\_COLLECTED**

Que đã lấy được phấn.

↓

## **STATE 6**

**POLLEN\_ON\_STIGMA**

Hạt phấn đã đến đầu nhụy.

↓

## **STATE 7**

**POLLINATION\_COMPLETE**

Thụ phấn hoàn thành.

↓

## **STATE 8**

**POLLEN\_GERMINATION**

Hạt phấn nảy mầm.

↓

## **STATE 9**

**POLLEN\_TUBE**

Ống phấn phát triển.

↓

## **STATE 10**

**POLLEN\_TUBE\_REACH\_OVULE**

Ống phấn đến noãn.

↓

## **STATE 11**

**MALE\_CELL\_TRANSFER**

Tế bào sinh dục đực đi vào noãn.

↓

## **STATE 12**

**FERTILIZATION\_COMPLETE**

Thụ tinh xảy ra.

↓

## **STATE 13**

**FRUIT\_DEVELOPMENT**

Bầu nhụy phát triển thành quả.

↓

## **STATE 14**

**SEED\_DEVELOPMENT**

Noãn phát triển thành hạt.

↓

## **STATE 15**

**FRUIT\_RIPENING**

Quả xanh chuyển dần sang vàng rồi đỏ.

↓

## **STATE 16**

**RIPE\_FRUIT**

Quả chín.

↓

## **STATE 17**

**FINAL\_OBSERVATION**

Quan sát hạt bên trong quả.

↓

## **STATE 18**

**COMPLETE**

Thí nghiệm hoàn thành.

---

# **XLIII. LOGIC RESET**

Khi người dùng xác nhận:

**LÀM LẠI**

thực hiện:

stopAllAnimations()

resetTimeToDay0()

resetFlower()

clearCollectedPollen()

clearPollenFromStigma()

removePollenTube()

pollination \= false

fertilization \= false

removeFruit()

removeSeeds()

returnToolsToTray()

clearExperimentTable()

lockAllStepsExceptFlowerStructure()

resetProgressBar()

resetCamera()

resetMessages()

resetObservationMode()

state \= INITIAL

---

# **XLIV. CÁC ĐIỀU KIỆN KHÔNG ĐƯỢC BỎ QUA**

Hệ thống bắt buộc phải đảm bảo:

1. Chưa có hoa → không được quan sát.  
2. Chưa đặt hoa → không được dùng kính lúp.  
3. Chưa quan sát cấu tạo → không mở thao tác lấy phấn.  
4. Chưa quan sát nhị và nhụy → không mở thụ phấn.  
5. Chưa lấy được phấn → không thể thực hiện bước đưa phấn.  
6. Chưa đưa phấn đến đầu nhụy → không xảy ra thụ phấn.  
7. Chưa thụ phấn → không kích hoạt thụ tinh.  
8. Chưa hình thành ống phấn → không thể kéo ống phấn.  
9. Chưa đưa ống phấn đến noãn → không thể đưa tế bào sinh dục đực vào noãn.  
10. Chưa thụ tinh → không được tạo quả.  
11. Chưa quan sát quá trình tạo hạt → không chuyển sang trạng thái hoàn chỉnh.  
12. Chưa đến ngày 30 → không xuất hiện quả chín.  
13. Chưa có quả chín → không được mở quan sát hạt cuối cùng.

---

# **XLV. XỬ LÝ TẤT CẢ VẬT THỂ KÉO SAI**

Nguyên tắc chung:

**Vật thể kéo sai vị trí phải tự động quay lại đúng vị trí ban đầu hoặc vị trí hợp lệ gần nhất.**

Không để vật thể nằm ở vị trí sai làm ảnh hưởng đến trạng thái thí nghiệm.

Áp dụng cho:

* kính lúp;  
* que lấy phấn;  
* hạt phấn;  
* ống phấn;  
* tế bào sinh dục đực.

---

# **XLVI. HỆ THỐNG THÔNG BÁO**

Các thông báo chính cần có:

### **Khi chưa đặt hoa**

> **“Hãy đặt hoa cà chua lên bàn trước.”**

### **Khi lấy phấn sai**

> **“Hãy đưa que đến bao phấn để lấy hạt phấn.”**

### **Khi lấy được phấn**

> **“Đã lấy hạt phấn từ bao phấn.”**

### **Khi đưa phấn sai**

> **“Hãy đưa hạt phấn đến đầu nhụy.”**

### **Khi thụ phấn thành công**

> **“Thụ phấn đã xảy ra.”**

### **Giải thích thụ phấn**

> **“Thụ phấn là quá trình hạt phấn được chuyển từ bao phấn đến đầu nhụy.”**

### **Khi nhấp sai hạt phấn**

> **“Hãy nhấp vào hạt phấn trên đầu nhụy.”**

### **Khi hình thành ống phấn**

> **“Hạt phấn nảy mầm và hình thành ống phấn.”**

### **Khi kéo ống phấn sai**

> **“Hãy đưa ống phấn đi xuống qua vòi nhụy.”**

### **Khi đến vùng noãn**

> **“Đưa đầu ống phấn đến một noãn.”**

### **Khi ống phấn đến noãn**

> **“Ống phấn đã đến noãn.”**

### **Khi đưa tế bào sinh dục đực sai**

> **“Hãy đưa tế bào sinh dục đực theo ống phấn vào bên trong noãn.”**

### **Khi thụ tinh**

> **“THỤ TINH ĐÃ XẢY RA”**

### **Giải thích thụ tinh**

> **“Tế bào sinh dục đực kết hợp với tế bào sinh dục cái trong noãn.”**

### **Khi bầu nhụy tạo quả**

> **“Sau khi thụ tinh, bầu nhụy phát triển thành quả.”**

### **Khi noãn tạo hạt**

> **“Sau khi thụ tinh, noãn phát triển thành hạt.”**

### **Khi quả chín**

> **“Quả cà chua đã chín. Nhấp vào quả để quan sát các hạt bên trong.”**

### **Khi quan sát quả**

> **“Quả cà chua chứa nhiều hạt.”**

---

# **XLVII. YÊU CẦU VỀ TRẢI NGHIỆM HỌC SINH**

Giao diện phải giúp học sinh luôn biết:

* mình đang ở bước nào;  
* cần thao tác gì;  
* phải kéo vật thể đến đâu;  
* thao tác đúng hay sai;  
* vì sao thao tác sai;  
* bước tiếp theo là gì.

Không để học sinh rơi vào trạng thái:

* không biết phải làm gì;  
* không biết vật thể nào có thể sử dụng;  
* không biết vị trí mục tiêu;  
* không biết vì sao thao tác không hoạt động.

---

# **XLVIII. NGUYÊN TẮC KHÔNG CHO PHÉP “NHẢY BƯỚC”**

Học sinh không được phép dùng thao tác sau để bỏ qua bước:

* click liên tục;  
* click sai vị trí;  
* kéo vật thể vào vùng không hợp lệ;  
* nhấp trực tiếp vào bước trên thanh tiến trình;  
* sử dụng dụng cụ trước khi được mở khóa.

Thanh tiến trình chỉ có chức năng:

**HIỂN THỊ TIẾN ĐỘ**

không phải công cụ để bỏ qua thao tác.

---

# **XLIX. TRẠNG THÁI HOÀN THÀNH**

Khi hoàn thành toàn bộ thí nghiệm:

Thanh tiến trình đạt:

**HOÀN THÀNH**

Màn hình giữ lại:

* quả cà chua chín;  
* quả được mở/cắt đôi;  
* các hạt bên trong;  
* hạt được phóng đại;  
* kết quả cuối cùng của thí nghiệm.

Các thao tác chính không cần thiết có thể được khóa lại để học sinh tập trung vào kết quả.

---

# **L. KẾT LUẬN KIẾN THỨC HIỂN THỊ CUỐI THÍ NGHIỆM**

Sau khi hoàn thành, hiển thị phần tổng kết:

## **KẾT QUẢ THÍ NGHIỆM**

**1\. Hoa có cơ quan sinh sản là nhị và nhụy.**

**2\. Bao phấn chứa và tạo ra hạt phấn.**

**3\. Thụ phấn là quá trình hạt phấn được chuyển từ bao phấn đến đầu nhụy.**

**4\. Sau khi hạt phấn đến đầu nhụy, hạt phấn có thể nảy mầm và hình thành ống phấn.**

**5\. Ống phấn phát triển qua vòi nhụy và đi đến noãn.**

**6\. Tế bào sinh dục đực theo ống phấn đi vào noãn và kết hợp với tế bào sinh dục cái. Đây là quá trình thụ tinh.**

**7\. Sau khi thụ tinh, bầu nhụy phát triển thành quả.**

**8\. Sau khi thụ tinh, noãn phát triển thành hạt.**

**9\. Quả cà chua tiếp tục phát triển, chuyển từ quả xanh sang quả chín và bên trong chứa nhiều hạt.**

---

# **LI. SƠ ĐỒ KIẾN THỨC CUỐI CÙNG**

Web có thể hiển thị sơ đồ tổng kết:

**NHỊ**

→ **BAO PHẤN**

→ **HẠT PHẤN**

↓

**THỤ PHẤN**

↓

**ĐẦU NHỤY**

↓

**HẠT PHẤN NẢY MẦM**

↓

**ỐNG PHẤN**

↓

**NOÃN**

↓

**TẾ BÀO SINH DỤC ĐỰC \+ TẾ BÀO SINH DỤC CÁI**

↓

**THỤ TINH**

↓

**BẦU NHỤY → QUẢ**

**NOÃN → HẠT**

↓

**QUẢ CHÍN CÓ HẠT**

---

# **LII. CHECKLIST CHO LẬP TRÌNH VIÊN**

## **Giao diện**

* Khay dụng cụ cố định bên trái.  
* Bàn thí nghiệm ở trung tâm.  
* Bối cảnh sân vườn.  
* Thanh tiến trình phía trên.  
* Nút “LÀM LẠI THÍ NGHIỆM” luôn hiển thị.  
* Popup xác nhận reset.

## **Vật thể 3D**

* Hoa cà chua 3D.  
* Hoa màu vàng.  
* 5 cánh hoa.  
* Nhị.  
* Chỉ nhị.  
* Bao phấn.  
* Hạt phấn.  
* Nhụy.  
* Đầu nhụy.  
* Vòi nhụy.  
* Bầu nhụy.  
* Noãn.  
* Kính lúp 3D.  
* Que lấy phấn.  
* Quả cà chua xanh.  
* Quả cà chua chín.  
* Hạt cà chua.

## **Tương tác**

* Kéo hoa lên bàn.  
* Click hoa xem thông tin.  
* Kéo kính lúp.  
* Mở chế độ quan sát cấu tạo.  
* Click nhị.  
* Click chỉ nhị.  
* Click bao phấn.  
* Click nhụy.  
* Click đầu nhụy.  
* Click vòi nhụy.  
* Click bầu nhụy.  
* Quan sát noãn.  
* Lấy phấn.  
* Đưa phấn đến đầu nhụy.  
* Kích hoạt thụ phấn.  
* Click hạt phấn.  
* Tạo ống phấn.  
* Kéo ống phấn qua vòi nhụy.  
* Đưa ống phấn đến noãn.  
* Kéo tế bào sinh dục đực vào noãn.  
* Kích hoạt thụ tinh.  
* Tua thời gian.  
* Tạo quả.  
* Tạo hạt.  
* Quả chín.  
* Cắt quả.  
* Quan sát hạt.

## **Logic**

* Có khóa/mở khóa từng bước.  
* Không cho bỏ qua bước.  
* Có xử lý thao tác sai.  
* Vật thể sai tự quay về.  
* Có phản hồi bằng chữ.  
* Có phản hồi hình ảnh.  
* Có âm thanh ở thao tác quan trọng.  
* Có camera tự động.  
* Có hệ thống reset hoàn toàn.  
* Có trạng thái hoàn thành.

---

# **LIII. LUỒNG TRẢI NGHIỆM HOÀN CHỈNH**

Luồng trải nghiệm cuối cùng phải được triển khai đúng theo chuỗi:

**HỌC SINH VÀO THÍ NGHIỆM**

↓

**THẤY HOA CÀ CHUA TRONG KHAY**

↓

**KÉO HOA LÊN BÀN**

↓

**CLICK HOA XEM THÔNG TIN**

↓

**KÉO KÍNH LÚP ĐẾN HOA**

↓

**QUAN SÁT CẤU TẠO HOA**

↓

**QUAN SÁT NHỊ**

↓

**QUAN SÁT CHỈ NHỊ**

↓

**QUAN SÁT BAO PHẤN**

↓

**QUAN SÁT HẠT PHẤN**

↓

**QUAN SÁT NHỤY**

↓

**QUAN SÁT ĐẦU NHỤY**

↓

**QUAN SÁT VÒI NHỤY**

↓

**QUAN SÁT BẦU NHỤY**

↓

**QUAN SÁT NOÃN**

↓

**MỞ THAO TÁC THỤ PHẤN**

↓

**LẤY QUE**

↓

**ĐƯA QUE ĐẾN BAO PHẤN**

↓

**LẤY HẠT PHẤN**

↓

**ĐƯA QUE ĐẾN ĐẦU NHỤY**

↓

**HẠT PHẤN BÁM VÀO ĐẦU NHỤY**

↓

**THỤ PHẤN**

↓

**CHUYỂN SANG CẮT DỌC**

↓

**CLICK HẠT PHẤN**

↓

**HẠT PHẤN NẢY MẦM**

↓

**ỐNG PHẤN PHÁT TRIỂN**

↓

**KÉO ỐNG PHẤN QUA VÒI NHỤY**

↓

**ĐƯA ỐNG PHẤN ĐẾN NOÃN**

↓

**KÉO TẾ BÀO SINH DỤC ĐỰC VÀO NOÃN**

↓

**THỤ TINH**

↓

**NGÀY 0–3**

↓

**BẦU NHỤY PHÌNH TO**

↓

**NGÀY 7**

↓

**BẦU NHỤY → QUẢ XANH**

↓

**NGÀY 14**

↓

**QUAN SÁT NOÃN**

↓

**NOÃN → HẠT**

↓

**NGÀY 21**

↓

**QUẢ LỚN DẦN**

↓

**NGÀY 30**

↓

**QUẢ ĐỎ CHÍN**

↓

**CẮT QUẢ**

↓

**QUAN SÁT NHIỀU HẠT**

↓

**HOÀN THÀNH THÍ NGHIỆM**

---

# **LIV. YÊU CẦU CUỐI CÙNG CHO WEB**

Đây là một thí nghiệm **tương tác theo tiến trình**, vì vậy hệ thống không được thiết kế theo kiểu chỉ xem animation.

Học sinh phải thực sự tham gia vào quá trình bằng thao tác:

**QUAN SÁT → CLICK → KÉO → THẢ → KIỂM TRA → NHẬN PHẢN HỒI → MỞ KHÓA BƯỚC TIẾP THEO.**

Mọi bước quan trọng đều phải có:

* mục tiêu;  
* vùng tương tác;  
* điều kiện đúng;  
* điều kiện sai;  
* phản hồi;  
* animation;  
* cập nhật trạng thái.

Kết quả cuối cùng học sinh phải quan sát được đầy đủ chuỗi:

> **NHỊ → HẠT PHẤN → THỤ PHẤN → ỐNG PHẤN → NOÃN → THỤ TINH → BẦU NHỤY THÀNH QUẢ → NOÃN THÀNH HẠT → QUẢ CHÍN CÓ HẠT.**

Đồng thời toàn bộ thí nghiệm phải có khả năng **reset hoàn toàn** bằng nút **LÀM LẠI THÍ NGHIỆM**, đưa hệ thống trở về đúng trạng thái ban đầu để học sinh có thể thực hiện lại từ đầu.

# THÍ NGHIỆM 6

# **ĐẶC TẢ CHI TIẾT WEB THÍ NGHIỆM 6**

## **TÌM HIỂU SỰ HÌNH THÀNH CÂY CON TỪ HẠT, RỄ, THÂN VÀ LÁ CỦA THỰC VẬT**

### **Vật mẫu:**

* Hạt đậu xanh  
* Rễ khoai lang  
* Củ khoai tây có mắt  
* Lá cây thuốc bỏng

---

# **I. MỤC ĐÍCH CỦA THÍ NGHIỆM**

Thiết kế một thí nghiệm tương tác 3D dành cho học sinh tiểu học, giúp học sinh trực tiếp quan sát và thực hiện thí nghiệm để nhận biết:

* Cây con có thể hình thành từ **hạt**.  
* Cây con có thể hình thành từ **rễ**.  
* Cây con có thể hình thành từ **thân**.  
* Cây con có thể hình thành từ **lá**.

Thông qua 4 mẫu vật khác nhau, học sinh quan sát quá trình:

**HẠT → CÂY CON**

**RỄ → CÂY CON**

**THÂN → CÂY CON**

**LÁ → CÂY CON**

Sau đó quan sát tiếp:

**CÂY CON → CÂY LỚN DẦN → CÂY TRƯỞNG THÀNH**

Mục tiêu của web không phải chỉ cho học sinh xem animation mà phải để học sinh:

* kéo – thả vật mẫu;  
* đặt đúng chậu;  
* tưới nước;  
* sử dụng kính phóng đại;  
* quan sát từng mẫu;  
* theo dõi sự phát triển theo thời gian;  
* phân loại nguồn gốc hình thành cây con;  
* rút ra kết luận.

---

# **II. NGUYÊN TẮC THIẾT KẾ**

## **1\. Phong cách hình ảnh**

Toàn bộ thí nghiệm sử dụng hình ảnh:

* 3D;  
* chân thật;  
* trực quan;  
* gần với vật thật;  
* màu sắc tự nhiên;  
* phù hợp với học sinh tiểu học.

Các vật mẫu phải có kích thước tương đối hợp lý.

Không sử dụng biểu tượng 2D đơn giản để thay thế vật thể chính.

---

# **III. BỐ CỤC GIAO DIỆN**

Màn hình được chia thành:

## **1\. Khu vực bên trái**

**KHAY DỤNG CỤ THÍ NGHIỆM**

Chứa:

### **Vật mẫu**

1. Hạt đậu xanh.  
2. Mẫu rễ khoai lang.  
3. Củ khoai tây có mắt.  
4. Lá cây thuốc bỏng.

### **Dụng cụ**

5. Chậu 1 – ĐẬU XANH.  
6. Chậu 2 – KHOAI LANG.  
7. Chậu 3 – KHOAI TÂY.  
8. Chậu 4 – THUỐC BỎNG.  
9. Đất trồng.  
10. Bình tưới nước.  
11. Kính phóng đại 3D.

Tất cả vật dụng nằm cố định trong khay cho đến khi học sinh kéo ra sử dụng.

---

# **IV. NÚT “LÀM LẠI THÍ NGHIỆM”**

Ở góc dưới bên phải màn hình luôn hiển thị:

**LÀM LẠI THÍ NGHIỆM**

Nút phải:

* kích thước đủ lớn;  
* dễ nhìn;  
* dễ nhấp;  
* phù hợp với học sinh tiểu học.

---

## **Khi học sinh nhấp vào nút**

Hiển thị hộp thoại:

> **“Em có chắc muốn làm lại thí nghiệm không?”**

Bên dưới có hai nút:

**HỦY | LÀM LẠI**

---

## **Nếu chọn HỦY**

Hệ thống:

1. Đóng hộp thoại.  
2. Giữ nguyên toàn bộ tiến trình.  
3. Không xóa kết quả.  
4. Không thay đổi vị trí vật thể.  
5. Không reset thời gian.

---

## **Nếu chọn LÀM LẠI**

Hệ thống phải reset toàn bộ thí nghiệm:

1. Xóa toàn bộ kết quả quan sát.  
2. Dừng tất cả hiệu ứng.  
3. Đưa thời gian về **Ngày 0**.  
4. Đưa hạt đậu xanh về khay.  
5. Đưa mẫu rễ khoai lang về khay.  
6. Đưa củ khoai tây về khay.  
7. Đưa lá cây thuốc bỏng về khay.  
8. Xóa toàn bộ cây con.  
9. Xóa toàn bộ các giai đoạn phát triển.  
10. Đưa kính phóng đại về khay.  
11. Đưa bình tưới về vị trí ban đầu.  
12. Đưa tất cả chậu về khay.  
13. Xóa thông tin đã mở.  
14. Đưa bàn quan sát về trạng thái trống.  
15. Đưa thanh tiến trình về bước đầu tiên.  
16. Khóa tất cả các bước chưa thực hiện.  
17. Reset camera.  
18. Reset các thông báo.  
19. Reset các trạng thái kéo – thả.  
20. Đưa hệ thống về trạng thái ban đầu.

---

# **V. KHAY DỤNG CỤ CỐ ĐỊNH**

Khu vực bên trái là:

**KHAY DỤNG CỤ**

Học sinh phải:

**KÉO → THẢ**

vật dụng từ khay bên trái lên bàn quan sát ở giữa.

Không cho phép học sinh click để vật thể tự động xuất hiện trên bàn.

---

# **VI. VẬT MẪU 1 – HẠT ĐẬU XANH**

## **Hình ảnh**

Thiết kế:

* hạt đậu xanh nguyên vẹn;  
* kích thước tương đối thực tế;  
* màu xanh tự nhiên;  
* hình dạng giống hạt đậu xanh thật.

Hạt phải được thể hiện rõ để học sinh nhận biết đây là **hạt**.

---

# **VII. VẬT MẪU 2 – RỄ KHOAI LANG**

Thiết kế:

* một mẫu rễ khoai lang;  
* có phần rễ nằm trong đất;  
* rễ có các nhánh;  
* thể hiện rõ cấu trúc rễ.

Khi phóng đại, học sinh phải nhìn thấy:

* rễ chính;  
* rễ nhánh;  
* vùng có khả năng xuất hiện chồi mới theo mô phỏng của thí nghiệm.

---

# **VIII. VẬT MẪU 3 – CỦ KHOAI TÂY**

Thiết kế:

* một củ khoai tây;  
* hình dạng tự nhiên;  
* có nhiều **mắt khoai tây** trên bề mặt.

Các mắt phải nhìn thấy rõ.

Mắt khoai tây là vùng được sử dụng trong mô phỏng để thể hiện chồi có thể phát triển thành cây mới.

---

# **IX. VẬT MẪU 4 – LÁ CÂY THUỐC BỎNG**

Thiết kế:

* một lá thuốc bỏng khỏe mạnh;  
* lá dày;  
* mọng nước;  
* màu xanh tự nhiên;  
* hình dáng chân thật.

Mép lá phải đủ rõ để mô phỏng quá trình:

**MÉP LÁ → CÂY CON**

---

# **X. BỐI CẢNH KHU VỰC TRUNG TÂM**

Khu vực trung tâm là:

**BÀN QUAN SÁT BẰNG GỖ**

Bàn được đặt trong bối cảnh sân vườn sạch sẽ.

Bối cảnh gồm:

* ánh sáng tự nhiên;  
* không khí thoáng;  
* nền sân vườn;  
* đất trồng;  
* bàn gỗ;  
* khu vực đặt 4 chậu.

---

# **XI. 4 VỊ TRÍ CHẬU TRÊN BÀN**

Trên bàn có 4 vị trí cố định:

**CHẬU 1 – HẠT ĐẬU XANH**

**CHẬU 2 – RỄ KHOAI LANG**

**CHẬU 3 – THÂN KHOAI TÂY**

**CHẬU 4 – LÁ THUỐC BỎNG**

Mỗi vị trí có:

* vùng nhận diện;  
* nhãn;  
* hiệu ứng highlight khi kéo đúng vật thể đến gần.

---

# **XII. ĐẶT 4 CHẬU**

Học sinh phải lần lượt kéo:

**CHẬU 1 → VỊ TRÍ CHẬU 1**

**CHẬU 2 → VỊ TRÍ CHẬU 2**

**CHẬU 3 → VỊ TRÍ CHẬU 3**

**CHẬU 4 → VỊ TRÍ CHẬU 4**

---

## **Khi kéo đúng**

Chậu:

* được đặt cố định;  
* không quay lại khay.

Hiển thị:

> **“Đã đặt chậu đúng vị trí.”**

---

## **Khi kéo sai**

Ví dụ:

Học sinh kéo:

**CHẬU 1 → VỊ TRÍ CHẬU 3**

Hệ thống:

1. Không cho đặt.  
2. Chậu quay lại khay.  
3. Hiển thị:

> **“Hãy đặt chậu vào đúng vị trí.”**

---

# **XIII. LOGIC ĐẶT CHẬU**

Chưa đặt đủ 4 chậu:

**KHÓA ĐẶT VẬT MẪU**

Chỉ khi:

**4/4 CHẬU ĐÚNG VỊ TRÍ**

thì mới mở bước tiếp theo.

---

# **XIV. ĐẶT HẠT ĐẬU XANH**

Học sinh kéo:

**HẠT ĐẬU XANH → CHẬU 1**

---

## **Kéo đúng**

Hạt nằm trong đất.

Hiển thị:

> **“Đúng\! Đây là hạt đậu xanh.”**

Trạng thái:

**BEAN\_PLACED \= TRUE**

---

## **Kéo sai**

Ví dụ kéo hạt sang chậu khác.

Hiển thị:

> **“Chưa đúng. Hãy đặt hạt đậu xanh vào CHẬU 1.”**

Hạt tự động quay lại khay.

---

# **XV. ĐẶT RỄ KHOAI LANG**

Học sinh kéo:

**RỄ KHOAI LANG → CHẬU 2**

---

## **Kéo đúng**

Rễ được đặt vào đất.

Hiển thị:

> **“Đúng\! Đây là rễ khoai lang.”**

---

## **Kéo sai**

Hiển thị:

> **“Chưa đúng. Hãy đặt rễ khoai lang vào CHẬU 2.”**

Rễ quay lại khay.

---

# **XVI. ĐẶT KHOAI TÂY**

Học sinh kéo:

**CỦ KHOAI TÂY → CHẬU 3**

---

## **Kéo đúng**

Củ nằm trong đất.

Các mắt vẫn được nhìn thấy một phần để phục vụ quan sát.

Hiển thị:

> **“Đúng\! Đây là thân khoai tây có mắt có khả năng phát triển thành cây mới.”**

---

## **Kéo sai**

Hiển thị:

> **“Chưa đúng. Hãy đặt khoai tây vào CHẬU 3.”**

Khoai tây quay lại khay.

---

# **XVII. ĐẶT LÁ THUỐC BỎNG**

Học sinh kéo:

**LÁ THUỐC BỎNG → CHẬU 4**

---

## **Kéo đúng**

Lá nằm đúng vị trí trên đất.

Hiển thị:

> **“Đúng\! Đây là lá cây thuốc bỏng có khả năng hình thành cây con.”**

---

## **Kéo sai**

Hiển thị:

> **“Chưa đúng. Hãy đặt lá thuốc bỏng vào CHẬU 4.”**

Lá quay lại khay.

---

# **XVIII. HOÀN THÀNH ĐẶT 4 VẬT MẪU**

Khi cả 4 vật mẫu đã được đặt đúng:

* đánh dấu 4/4;  
* mở dụng cụ tưới nước;  
* cho phép học sinh sử dụng bình tưới.

Thanh tiến trình chuyển sang:

**CHUẨN BỊ TƯỚI NƯỚC**

---

# **XIX. TƯỚI NƯỚC**

Sau khi đặt đủ 4 vật mẫu:

Học sinh sử dụng:

**BÌNH TƯỚI NƯỚC**

Thực hiện lần lượt:

**Chậu 1 → Chậu 2 → Chậu 3 → Chậu 4**

---

## **Khi tưới đúng**

Nước chảy ra khỏi bình.

Hiển thị animation:

* dòng nước;  
* nước rơi xuống đất;  
* đất hơi tối/ẩm hơn;  
* hiệu ứng nước thấm vào đất.

Hiển thị:

> **“Đã cung cấp nước.”**

---

## **Khi tưới sai**

Nếu bình tưới không hướng vào chậu:

Hiển thị:

> **“Hãy tưới nước vào chậu cây.”**

Bình tưới quay về vị trí ban đầu.

---

# **XX. HOÀN THÀNH TƯỚI NƯỚC**

Khi cả 4 chậu đã được tưới:

**WATERING\_COMPLETE \= TRUE**

Hệ thống mở:

**▶ BẮT ĐẦU QUAN SÁT**

Trước thời điểm này, nút phải ở trạng thái khóa.

---

# **XXI. KÍNH PHÓNG ĐẠI 3D**

Kính phóng đại nằm trong khay bên trái.

Học sinh có thể kéo kính đến từng chậu.

Kính có thể di chuyển qua lại giữa 4 chậu.

---

# **XXII. QUAN SÁT HẠT ĐẬU XANH**

Khi đưa kính đến:

**CHẬU 1**

vùng bên dưới kính được phóng đại.

Hiển thị:

**HẠT ĐẬU XANH**

Học sinh nhìn thấy:

* vỏ hạt;  
* phần bên trong hạt;  
* phần bắt đầu nứt;  
* dấu hiệu bắt đầu nảy mầm.

---

# **XXIII. QUAN SÁT RỄ KHOAI LANG**

Khi đưa kính đến:

**CHẬU 2**

Hiển thị:

**RỄ KHOAI LANG**

Quan sát được:

* rễ chính;  
* rễ nhánh;  
* vùng có khả năng hình thành chồi.

---

# **XXIV. QUAN SÁT KHOAI TÂY**

Khi đưa kính đến:

**CHẬU 3**

Hiển thị:

**MẮT KHOAI TÂY**

Quan sát được:

* mắt khoai tây;  
* chồi bắt đầu phát triển.

---

# **XXV. QUAN SÁT LÁ THUỐC BỎNG**

Khi đưa kính đến:

**CHẬU 4**

Hiển thị:

**MÉP LÁ THUỐC BỎNG**

Quan sát được:

* mép lá;  
* các điểm nhỏ;  
* cây con nhỏ bắt đầu hình thành.

---

# **XXVI. NÚT “BẮT ĐẦU QUAN SÁT”**

Nút:

**▶ BẮT ĐẦU QUAN SÁT**

chỉ được mở khi:

* 4 chậu đã đặt đúng;  
* 4 vật mẫu đã đặt đúng;  
* đã hoàn thành tưới nước.

Nếu thiếu bất kỳ điều kiện nào:

**NÚT BỊ KHÓA**

---

# **XXVII. BẮT ĐẦU TUA NHANH THỜI GIAN**

Khi học sinh nhấp:

**▶ BẮT ĐẦU QUAN SÁT**

hệ thống:

1. Ghi nhận thời điểm bắt đầu.  
2. Khóa các thao tác đặt vật mẫu.  
3. Bắt đầu animation phát triển.  
4. Hiển thị thanh thời gian.  
5. Hiển thị:

**NGÀY 0**

Sau đó thời gian tăng:

**NGÀY 2 → NGÀY 4 → NGÀY 7 → NGÀY 14 → ...**

4 chậu phát triển đồng thời.

---

# **XXVIII. THANH THỜI GIAN**

Thanh thời gian phải thể hiện rõ:

**NGÀY 0 → NGÀY 2 → NGÀY 4 → NGÀY 7 → NGÀY 14 → CÁC GIAI ĐOẠN TIẾP THEO**

Có thể sử dụng:

* timeline;  
* thanh tiến trình;  
* nhãn ngày;  
* hiệu ứng tua nhanh.

Tại các mốc quan trọng, hệ thống có thể tạm dừng để học sinh quan sát.

---

# **XXIX. TRƯỜNG HỢP 1 – CÂY ĐẬU XANH HÌNH THÀNH TỪ HẠT**

## **Ngày 0**

Hạt đậu xanh nằm trong đất.

Không có cây con.

---

## **Ngày 2**

Hạt hút nước.

Vỏ hạt bắt đầu nứt.

Animation:

* hạt hơi phồng;  
* vỏ nứt;  
* phần mầm bắt đầu xuất hiện.

Hiển thị:

> **“Hạt bắt đầu nảy mầm.”**

---

## **Ngày 4**

Rễ mọc ra.

Rễ phát triển:

* dài hơn;  
* hướng xuống đất.

---

## **Ngày 7**

Chồi mọc lên khỏi mặt đất.

Hệ thống cho phép camera quan sát:

* rễ phía dưới;  
* chồi phía trên.

---

## **Ngày 14**

Xuất hiện:

**CÂY ĐẬU XANH CON**

Hiển thị:

> **“Cây con được hình thành từ hạt.”**

---

# **XXX. TRƯỜNG HỢP 2 – CÂY KHOAI LANG HÌNH THÀNH TỪ RỄ**

## **Ngày 0**

Mẫu rễ khoai lang nằm trong đất.

---

## **Sau một thời gian**

Từ phần rễ xuất hiện:

**CHỒI MỚI**

Chồi bắt đầu nhô lên khỏi mặt đất.

---

## **Giai đoạn tiếp theo**

Chồi:

* phát triển;  
* cao dần;  
* xuất hiện lá non;  
* tiếp tục phát triển rễ.

Hiển thị:

> **“Cây con được hình thành từ rễ khoai lang.”**

---

# **XXXI. TRƯỜNG HỢP 3 – CÂY KHOAI TÂY HÌNH THÀNH TỪ THÂN**

## **Ngày 0**

Củ khoai tây nằm trong đất.

Các mắt nằm trên bề mặt củ.

---

## **Sau một thời gian**

Các mắt khoai tây bắt đầu:

* nhú chồi;  
* chồi dài dần.

---

## **Giai đoạn tiếp theo**

Xuất hiện:

* chồi;  
* rễ;  
* thân;  
* lá.

Thân phát triển lên trên mặt đất.

Hiển thị:

> **“Cây con được hình thành từ thân khoai tây.”**

---

# **XXXII. TRƯỜNG HỢP 4 – CÂY THUỐC BỎNG HÌNH THÀNH TỪ LÁ**

## **Ngày 0**

Lá thuốc bỏng nằm trên đất.

---

## **Sau một thời gian**

Tại mép lá xuất hiện:

**CÁC CÂY CON RẤT NHỎ**

---

## **Giai đoạn tiếp theo**

Cây con:

* lớn dần;  
* xuất hiện rễ;  
* chồi phát triển;  
* xuất hiện lá non;  
* dần tách khỏi lá mẹ.

Hiển thị:

> **“Cây con được hình thành từ lá.”**

---

# **XXXIII. QUAN SÁT 4 CHẬU ĐỒNG THỜI**

Trong quá trình tua nhanh:

**4 chậu luôn được hiển thị đồng thời.**

Mục đích:

Giúp học sinh so sánh:

| Chậu | Vật mẫu | Cây con hình thành từ |
| ----- | ----- | ----- |
| Chậu 1 | Hạt đậu xanh | Hạt |
| Chậu 2 | Rễ khoai lang | Rễ |
| Chậu 3 | Củ khoai tây | Thân |
| Chậu 4 | Lá thuốc bỏng | Lá |

---

# **XXXIV. CLICK VÀO TỪNG CHẬU**

Trong quá trình phát triển, học sinh có thể nhấp vào từng chậu.

---

## **Nhấp Chậu 1**

Mở chế độ quan sát:

**ĐẬU XANH – HÌNH THÀNH TỪ HẠT**

Camera phóng to chậu 1\.

---

## **Nhấp Chậu 2**

Hiển thị:

**KHOAI LANG – HÌNH THÀNH TỪ RỄ**

---

## **Nhấp Chậu 3**

Hiển thị:

**KHOAI TÂY – HÌNH THÀNH TỪ THÂN**

---

## **Nhấp Chậu 4**

Hiển thị:

**THUỐC BỎNG – HÌNH THÀNH TỪ LÁ**

---

## **Nút quay lại**

Hiển thị nút:

**← QUAY LẠI QUAN SÁT 4 CHẬU**

Khi nhấp:

* đóng chế độ phóng to;  
* quay lại góc nhìn 4 chậu.

---

# **XXXV. GIAI ĐOẠN CÂY CON**

Sau khi 4 cây con hình thành:

Thanh tiến trình cập nhật:

**CÂY CON ĐÃ HÌNH THÀNH**

Hệ thống tạm dừng một khoảng thời gian ngắn.

Cho học sinh quan sát cả 4 cây.

---

# **XXXVI. PHÂN LOẠI HÌNH THÀNH CÂY CON**

Sau khi cả 4 cây con đã hình thành, mở bài tập tương tác:

## **Yêu cầu**

> **“Hãy kéo mỗi thẻ vào đúng cây.”**

Hiển thị 4 thẻ:

**HẠT**

**RỄ**

**THÂN**

**LÁ**

Bên cạnh là 4 hình:

* cây đậu xanh;  
* cây khoai lang;  
* cây khoai tây;  
* cây thuốc bỏng.

---

# **XXXVII. ĐÁP ÁN PHÂN LOẠI**

Học sinh phải kéo:

**HẠT → ĐẬU XANH**

**RỄ → KHOAI LANG**

**THÂN → KHOAI TÂY**

**LÁ → THUỐC BỎNG**

---

# **XXXVIII. KHI KÉO ĐÚNG**

Thẻ:

* phát sáng;  
* được cố định;  
* không thể kéo nhầm lại.

Hiển thị:

> **“Chính xác\!”**

Có thể phát âm thanh xác nhận nhẹ.

---

# **XXXIX. KHI KÉO SAI**

Hiển thị:

> **“Chưa đúng. Hãy quan sát lại thí nghiệm.”**

Thẻ:

* không được cố định;  
* tự động quay về vị trí ban đầu.

Tiến trình không bị ảnh hưởng.

---

# **XL. HOÀN THÀNH PHÂN LOẠI**

Khi cả 4 thẻ được đặt đúng:

**CLASSIFICATION\_COMPLETE \= TRUE**

Hiển thị:

> **“Em đã phân loại đúng 4 cách hình thành cây con.”**

Mở bước:

**CÂY CON → CÂY TRƯỞNG THÀNH**

---

# **XLI. CÂY CON PHÁT TRIỂN THÀNH CÂY TRƯỞNG THÀNH**

Sau khi cả 4 cây con hình thành và bài tập phân loại hoàn thành:

Hệ thống tiếp tục tua nhanh:

**CÂY CON → CÂY LỚN DẦN → CÂY TRƯỞNG THÀNH**

Cả 4 cây phát triển đồng thời.

---

# **XLII. CÂY ĐẬU XANH – GIAI ĐOẠN CÂY CON**

Cây có:

* thân non;  
* thân nhỏ;  
* thân mềm;  
* một vài lá non;  
* bộ rễ màu trắng;  
* rễ bắt đầu phát triển xuống đất.

Cây còn nhỏ.

---

# **XLIII. CÂY ĐẬU XANH – GIAI ĐOẠN LỚN DẦN**

Thân:

* cao lên;  
* to hơn.

Lá:

* xuất hiện thêm;  
* mở rộng;  
* xanh rõ hơn.

Cành bên bắt đầu phát triển.

Bộ rễ:

* dài hơn;  
* có nhiều rễ nhánh;  
* đâm sâu hơn vào đất.

Cây đứng vững hơn.

---

# **XLIV. CÂY ĐẬU XANH – GIAI ĐOẠN TRƯỞNG THÀNH**

Cây có:

* thân cao;  
* thân cứng cáp;  
* phân nhánh rõ;  
* nhiều lá xanh;  
* lá lớn;  
* hệ rễ phát triển mạnh.

Hiệu ứng:

**THẤP → CAO DẦN**

**ÍT LÁ → NHIỀU LÁ**

**RỄ NGẮN → RỄ DÀI VÀ NHIỀU NHÁNH**

---

# **XLV. CÂY KHOAI LANG – GIAI ĐOẠN CÂY CON**

Chồi non:

* mọc từ mẫu khoai lang;  
* thân ngắn;  
* mềm;  
* xuất hiện lá đầu tiên;  
* rễ non bắt đầu phát triển.

---

# **XLVI. CÂY KHOAI LANG – GIAI ĐOẠN LỚN DẦN**

Thân:

* dài ra;  
* bò lan trên mặt đất.

Lá:

* xuất hiện nhiều hơn;  
* lớn dần;  
* màu xanh rõ hơn.

Các đoạn thân kéo dài.

Rễ phát triển mạnh hơn.

---

# **XLVII. CÂY KHOAI LANG – GIAI ĐOẠN TRƯỞNG THÀNH**

Cây có:

* thân dài;  
* mềm;  
* bò lan;  
* nhiều lá;  
* nhiều nhánh;  
* bộ rễ phát triển.

Hiệu ứng:

**CHỒI NHỎ → THÂN DÀI → NHIỀU LÁ → CÂY PHÁT TRIỂN RỘNG**

---

# **XLVIII. CÂY KHOAI TÂY – GIAI ĐOẠN CÂY CON**

Từ mắt khoai tây:

* chồi non mọc lên;  
* chồi thấp;  
* chồi mảnh;  
* có một vài lá non;  
* rễ bắt đầu phát triển xuống đất.

---

# **XLIX. CÂY KHOAI TÂY – GIAI ĐOẠN LỚN DẦN**

Chồi:

* dài ra;  
* phát triển thành thân.

Rễ:

* dài hơn;  
* có thêm rễ nhánh.

Lá:

* xuất hiện nhiều hơn;  
* mở rộng.

---

# **L. CÂY KHOAI TÂY – GIAI ĐOẠN TRƯỞNG THÀNH**

Cây có:

* thân phát triển rõ;  
* nhiều lá xanh;  
* hệ rễ phát triển;  
* cây có kích thước lớn hơn cây con ban đầu.

Mô hình phải giữ được mối liên hệ:

**MẮT KHOAI TÂY → CHỒI → CÂY CON → CÂY PHÁT TRIỂN**

---

# **LI. CÂY THUỐC BỎNG – GIAI ĐOẠN CÂY CON**

Các cây con nhỏ:

* xuất hiện ở mép lá;  
* có thân rất ngắn;  
* có một vài lá nhỏ;  
* rễ trắng bắt đầu mọc;  
* kích thước nhỏ hơn nhiều so với lá mẹ.

---

# **LII. CÂY THUỐC BỎNG – GIAI ĐOẠN LỚN DẦN**

Cây con:

* tách khỏi lá mẹ;  
* tiếp tục phát triển;  
* thân dài hơn;  
* lá mới xuất hiện;  
* rễ dài hơn;  
* nhiều rễ nhánh hơn.

---

# **LIII. CÂY THUỐC BỎNG – GIAI ĐOẠN TRƯỞNG THÀNH**

Cây có:

* thân phát triển;  
* thân cứng cáp;  
* nhiều lá;  
* lá dày;  
* lá mọng nước;  
* màu xanh rõ;  
* hệ rễ phát triển mạnh.

Hiệu ứng:

**CÂY CON Ở MÉP LÁ → CÂY CON CÓ RỄ → CÂY LỚN → CÂY TRƯỞNG THÀNH**

---

# **LIV. SO SÁNH 4 QUÁ TRÌNH**

Ở giai đoạn hoàn thành, có thể hiển thị 4 chậu cạnh nhau.

### **Chậu 1**

**HẠT → CÂY ĐẬU XANH**

### **Chậu 2**

**RỄ → CÂY KHOAI LANG**

### **Chậu 3**

**THÂN → CÂY KHOAI TÂY**

### **Chậu 4**

**LÁ → CÂY THUỐC BỎNG**

Mục đích là giúp học sinh nhìn thấy sự khác nhau về nguồn gốc hình thành cây con.

---

# **LV. THANH TIẾN TRÌNH**

Thanh tiến trình có thể triển khai:

**CHUẨN BỊ**

→ **ĐẶT MẪU**

→ **TƯỚI NƯỚC**

→ **QUAN SÁT**

→ **CÂY CON**

→ **PHÂN LOẠI**

→ **CÂY TRƯỞNG THÀNH**

→ **HOÀN THÀNH**

Mỗi bước:

* chưa thực hiện: khóa;  
* đang thực hiện: sáng;  
* hoàn thành: đánh dấu ✓.

---

# **LVI. LOGIC KHÓA / MỞ**

## **STATE 0 – BAN ĐẦU**

Chỉ cho phép:

**Đặt chậu**

---

## **STATE 1 – ĐÃ ĐẶT 4 CHẬU**

Mở:

**Đặt vật mẫu**

---

## **STATE 2 – ĐÃ ĐẶT 4 VẬT MẪU**

Mở:

**Tưới nước**

---

## **STATE 3 – ĐÃ TƯỚI 4 CHẬU**

Mở:

**BẮT ĐẦU QUAN SÁT**

---

## **STATE 4 – ĐANG QUAN SÁT**

Kích hoạt:

* timeline;  
* animation;  
* cây phát triển.

---

## **STATE 5 – 4 CÂY CON ĐÃ HÌNH THÀNH**

Mở:

**PHÂN LOẠI HẠT – RỄ – THÂN – LÁ**

---

## **STATE 6 – PHÂN LOẠI ĐÚNG**

Mở:

**CÂY CON → CÂY TRƯỞNG THÀNH**

---

## **STATE 7 – CÂY TRƯỞNG THÀNH**

Mở:

**KẾT LUẬN**

---

## **STATE 8 – HOÀN THÀNH**

Hiển thị kết quả cuối cùng.

---

# **LVII. KHÔNG CHO PHÉP BỎ QUA BƯỚC**

Học sinh không được:

* bỏ qua đặt chậu;  
* đặt vật mẫu trước khi đặt chậu;  
* tưới nước khi chưa có vật mẫu;  
* bắt đầu quan sát khi chưa tưới;  
* mở quá trình phát triển bằng cách click trực tiếp vào timeline;  
* bỏ qua phần hình thành cây con;  
* bỏ qua bài tập phân loại.

---

# **LVIII. QUY TẮC KÉO – THẢ**

Mỗi vật thể có vùng đích riêng.

## **Kéo đúng**

* vật thể được cố định;  
* cập nhật trạng thái;  
* phát animation;  
* hiển thị phản hồi.

## **Kéo sai**

* vật thể quay lại;  
* không cập nhật trạng thái;  
* hiển thị hướng dẫn.

---

# **LIX. QUY TẮC KÍNH PHÓNG ĐẠI**

Kính phóng đại có thể được sử dụng trong quá trình quan sát.

Khi di chuyển đến một vật thể:

1. Vùng bên dưới kính được phóng đại.  
2. Hiển thị tên đối tượng.  
3. Các bộ phận quan trọng được highlight.

Kính không được làm thay đổi trạng thái phát triển.

---

# **LX. CAMERA**

## **Góc nhìn tổng thể**

Camera nhìn được cả:

* bàn;  
* 4 chậu;  
* khay dụng cụ.

## **Khi quan sát riêng**

Camera zoom vào chậu được chọn.

## **Khi quan sát dưới đất**

Camera có thể chuyển sang góc nhìn xuyên đất để thấy:

* rễ;  
* rễ nhánh;  
* quá trình phát triển của rễ.

## **Khi quan sát lá thuốc bỏng**

Camera zoom vào mép lá.

## **Khi quan sát khoai tây**

Camera zoom vào mắt khoai tây.

---

# **LXI. ANIMATION PHÁT TRIỂN**

Animation phải diễn ra liên tục và mượt.

## **Hạt đậu xanh**

**Hạt → nứt vỏ → rễ → chồi → cây con**

## **Khoai lang**

**Rễ → chồi → thân → lá → cây con**

## **Khoai tây**

**Mắt → chồi → rễ → thân → lá → cây con**

## **Thuốc bỏng**

**Mép lá → cây con → rễ → thân → lá**

---

# **LXII. ANIMATION CÂY TRƯỞNG THÀNH**

Sau khi cây con hình thành:

### **Thân**

Tăng dần chiều cao và kích thước.

### **Lá**

Từ ít → nhiều.

### **Rễ**

Từ ngắn → dài → nhiều rễ nhánh.

### **Tổng thể**

Từ:

**CÂY CON**

→

**CÂY LỚN DẦN**

→

**CÂY TRƯỞNG THÀNH**

---

# **LXIII. PHẢN HỒI ĐÚNG**

Khi thao tác đúng, sử dụng kết hợp:

* highlight;  
* phát sáng;  
* chuyển động;  
* âm thanh nhẹ;  
* thông báo.

Ví dụ:

> **“Đúng\! Đây là hạt đậu xanh.”**

> **“Đã cung cấp nước.”**

> **“Cây con được hình thành từ hạt.”**

---

# **LXIV. PHẢN HỒI SAI**

Không sử dụng thông báo mang tính tiêu cực mạnh.

Sử dụng:

> **“Chưa đúng. Hãy quan sát lại thí nghiệm.”**

hoặc hướng dẫn cụ thể:

> **“Hãy đặt hạt đậu xanh vào CHẬU 1.”**

---

# **LXV. HỆ THỐNG TRẠNG THÁI CHO LẬP TRÌNH**

Có thể sử dụng các biến:

experimentState

potsPlaced  
pot1Placed  
pot2Placed  
pot3Placed  
pot4Placed

beanPlaced  
sweetPotatoRootPlaced  
potatoPlaced  
leafPlaced

wateringComplete  
pot1Watered  
pot2Watered  
pot3Watered  
pot4Watered

observationStarted

beanGerminated  
sweetPotatoSprouted  
potatoSprouted  
leafPlantletsFormed

allPlantletsFormed

classificationStarted  
beanClassified  
rootClassified  
stemClassified  
leafClassified

classificationComplete

beanMature  
sweetPotatoMature  
potatoMature  
leafPlantMature

experimentComplete

---

# **LXVI. STATE MACHINE**

INITIAL  
↓  
POTS\_PLACEMENT  
↓  
SAMPLES\_PLACEMENT  
↓  
WATERING  
↓  
OBSERVATION\_READY  
↓  
TIME\_LAPSE  
↓  
PLANTLETS\_FORMED  
↓  
CLASSIFICATION  
↓  
CLASSIFICATION\_COMPLETE  
↓  
PLANT\_GROWTH  
↓  
MATURE\_PLANTS  
↓  
CONCLUSION  
↓  
COMPLETE

---

# **LXVII. LOGIC RESET CHO TIẾT**

Khi xác nhận **LÀM LẠI**:

stopAllAnimations()

resetTimeline()

resetDayTo(0)

returnBeanToTray()

returnSweetPotatoRootToTray()

returnPotatoToTray()

returnLeafToTray()

returnMagnifyingGlassToTray()

returnWateringCanToTray()

returnAllPotsToTray()

removeAllPlantlets()

removeAllPlantGrowthStages()

clearOpenedInformation()

clearObservationWindows()

clearClassification()

clearWateringStates()

resetCamera()

resetProgress()

lockAllFutureSteps()

state \= INITIAL

---

# **LXVIII. THÔNG TIN HIỂN THỊ CUỐI THÍ NGHIỆM**

Sau khi hoàn thành toàn bộ:

Tiêu đề:

**KẾT QUẢ THÍ NGHIỆM**

Hiển thị 4 kết quả:

> **HẠT ĐẬU XANH → CÂY CON**

> **RỄ KHOAI LANG → CÂY CON**

> **THÂN KHOAI TÂY → CÂY CON**

> **LÁ THUỐC BỎNG → CÂY CON**

Sau đó:

> **“Cây con có thể hình thành từ những bộ phận khác nhau của thực vật.”**

---

# **LXIX. KẾT LUẬN KIẾN THỨC**

Hiển thị nội dung:

> **“Từ hạt, rễ, thân hoặc lá của thực vật, cây con có thể hình thành. Cây con tiếp tục phát triển rễ, thân và lá để trở thành cây trưởng thành.”**

---

# **LXX. SƠ ĐỒ TỔNG KẾT**

Web có thể hiển thị sơ đồ trực quan:

**HẠT**

↓

**CÂY ĐẬU XANH CON**

↓

**CÂY ĐẬU XANH TRƯỞNG THÀNH**

---

**RỄ KHOAI LANG**

↓

**CÂY KHOAI LANG CON**

↓

**CÂY KHOAI LANG TRƯỞNG THÀNH**

---

**THÂN KHOAI TÂY**

↓

**CÂY KHOAI TÂY CON**

↓

**CÂY KHOAI TÂY TRƯỞNG THÀNH**

---

**LÁ THUỐC BỎNG**

↓

**CÂY CON**

↓

**CÂY THUỐC BỎNG TRƯỞNG THÀNH**

---

# **LXXI. LUỒNG TRẢI NGHIỆM HOÀN CHỈNH**

Toàn bộ trải nghiệm phải diễn ra theo thứ tự:

**HỌC SINH VÀO THÍ NGHIỆM**

↓

**THẤY KHAY DỤNG CỤ**

↓

**KÉO CHẬU 1**

↓

**KÉO CHẬU 2**

↓

**KÉO CHẬU 3**

↓

**KÉO CHẬU 4**

↓

**4 CHẬU ĐƯỢC ĐẶT ĐÚNG**

↓

**KÉO HẠT ĐẬU XANH VÀO CHẬU 1**

↓

**KÉO RỄ KHOAI LANG VÀO CHẬU 2**

↓

**KÉO KHOAI TÂY VÀO CHẬU 3**

↓

**KÉO LÁ THUỐC BỎNG VÀO CHẬU 4**

↓

**4 VẬT MẪU ĐƯỢC ĐẶT ĐÚNG**

↓

**TƯỚI NƯỚC 4 CHẬU**

↓

**MỞ BẮT ĐẦU QUAN SÁT**

↓

**NGÀY 0**

↓

**NGÀY 2**

↓

**HẠT ĐẬU XANH NỨT VỎ**

↓

**NGÀY 4**

↓

**RỄ MỌC**

↓

**CHỒI XUẤT HIỆN**

↓

**4 MẪU BẮT ĐẦU HÌNH THÀNH CÂY CON**

↓

**NGÀY 7**

↓

**CÂY CON PHÁT TRIỂN**

↓

**NGÀY 14**

↓

**4 CÂY CON HÌNH THÀNH**

↓

**MỞ BÀI TẬP PHÂN LOẠI**

↓

**HẠT → ĐẬU XANH**

**RỄ → KHOAI LANG**

**THÂN → KHOAI TÂY**

**LÁ → THUỐC BỎNG**

↓

**HOÀN THÀNH PHÂN LOẠI**

↓

**TIẾP TỤC TUA NHANH**

↓

**CÂY CON LỚN DẦN**

↓

**THÂN PHÁT TRIỂN**

↓

**LÁ PHÁT TRIỂN**

↓

**RỄ PHÁT TRIỂN**

↓

**CÂY TRƯỞNG THÀNH**

↓

**HIỂN THỊ KẾT QUẢ**

↓

**HIỂN THỊ KẾT LUẬN**

↓

**HOÀN THÀNH THÍ NGHIỆM**

---

# **LXXII. CHECKLIST DÀNH CHO ĐỘI PHÁT TRIỂN WEB**

## **Giao diện**

* Khay dụng cụ cố định bên trái.  
* Bàn quan sát ở trung tâm.  
* Bối cảnh sân vườn.  
* 4 vị trí chậu.  
* Nút “LÀM LẠI THÍ NGHIỆM”.  
* Popup xác nhận reset.  
* Thanh tiến trình.  
* Timeline ngày.

## **Vật thể 3D**

* Hạt đậu xanh.  
* Rễ khoai lang.  
* Củ khoai tây có mắt.  
* Lá thuốc bỏng.  
* 4 chậu.  
* Đất.  
* Bình tưới.  
* Kính phóng đại.  
* Cây đậu xanh.  
* Cây khoai lang.  
* Cây khoai tây.  
* Cây thuốc bỏng.

## **Tương tác**

* Kéo chậu.  
* Kiểm tra vị trí chậu.  
* Kéo vật mẫu.  
* Kiểm tra vật mẫu.  
* Tưới nước.  
* Kiểm tra vùng tưới.  
* Sử dụng kính phóng đại.  
* Bắt đầu quan sát.  
* Tua nhanh thời gian.  
* Click từng chậu.  
* Phóng to từng chậu.  
* Phân loại Hạt/Rễ/Thân/Lá.  
* Theo dõi cây con.  
* Theo dõi cây trưởng thành.  
* Hiển thị kết luận.

## **Logic**

* Khóa/mở từng bước.  
* Không cho bỏ qua bước.  
* Kéo sai tự quay về.  
* Có phản hồi đúng.  
* Có phản hồi sai.  
* Có animation.  
* Có âm thanh.  
* Có camera tự động.  
* Có timeline.  
* Có reset hoàn toàn.  
* Có trạng thái hoàn thành.

---

# **LXXIII. YÊU CẦU QUAN TRỌNG VỀ TÍNH NHẤT QUÁN**

Trong toàn bộ web phải thống nhất đúng 4 đối tượng:

**HẠT ĐẬU XANH**

→ hình thành cây từ **HẠT**

**RỄ KHOAI LANG**

→ hình thành cây từ **RỄ**

**CỦ KHOAI TÂY CÓ MẮT**

→ hình thành cây từ **THÂN**

**LÁ CÂY THUỐC BỎNG**

→ hình thành cây từ **LÁ**

Không được để tên vật mẫu, hình ảnh, nhãn chậu và nội dung bài tập phân loại không thống nhất với nhau.

---

# **LXXIV. YÊU CẦU CUỐI CÙNG**

Đây phải là một **thí nghiệm tương tác**, không phải một video animation.

Học sinh phải tự mình thực hiện:

**ĐẶT → TƯỚI → QUAN SÁT → THEO DÕI → PHÂN LOẠI → KẾT LUẬN**

Web phải thể hiện rõ quá trình:

> **HẠT → CÂY CON**

> **RỄ → CÂY CON**

> **THÂN → CÂY CON**

> **LÁ → CÂY CON**

và sau đó:

> **CÂY CON → CÂY LỚN DẦN → CÂY TRƯỞNG THÀNH**

Mọi thao tác sai phải được xử lý rõ ràng.

Mọi bước bắt buộc phải được khóa/mở theo đúng tiến trình.

Mọi vật thể kéo sai phải tự động trở về vị trí phù hợp.

Khi hoàn thành, học sinh phải nhìn thấy đồng thời 4 trường hợp và hiểu được rằng **cây con có thể hình thành từ những bộ phận khác nhau của thực vật**.

# THÍ NGHIỆM 7

# **THÍ NGHIỆM: TÌM HIỂU SỰ SINH SẢN VÀ VÒNG ĐỜI CỦA ĐỘNG VẬT ĐẺ TRỨNG – BƯỚM**

---

# **I. MỤC TIÊU CỦA THÍ NGHIỆM**

Thiết kế một thí nghiệm tương tác 3D giúp học sinh quan sát và thực hiện theo trình tự:

**BƯỚM ĐỰC \+ BƯỚM CÁI → GIAO PHỐI → THỤ TINH → BƯỚM CÁI ĐẺ TRỨNG → TRỨNG → SÂU NON → NHỘNG → BƯỚM TRƯỞNG THÀNH → TIẾP TỤC SINH SẢN**

Học sinh được trực tiếp:

* Kéo – thả bướm đực và bướm cái.  
* Đưa bướm đực đến gần bướm cái.  
* Quan sát mô phỏng giao phối.  
* Quan sát quá trình thụ tinh bằng mô phỏng 3D đơn giản.  
* Đưa bướm cái lên lá cây.  
* Quan sát bướm cái đẻ trứng.  
* Dùng kính lúp để quan sát trứng.  
* Chuyển thời gian để quan sát trứng nở thành sâu non.  
* Cho sâu non ăn lá.  
* Quan sát sâu non lớn lên và lột xác.  
* Dùng thước đo để quan sát sự tăng trưởng của sâu.  
* Quan sát sâu hóa nhộng.  
* Dùng kính lúp quan sát nhộng.  
* Bật chế độ Mặt cắt 3D.  
* Quan sát các bộ phận của bướm đang hình thành bên trong nhộng.  
* Tua nhanh thời gian để quan sát bướm vũ hóa.  
* Quan sát bướm trưởng thành.  
* Sắp xếp đúng 4 giai đoạn vòng đời của bướm.  
* Quan sát sơ đồ tổng hợp toàn bộ quá trình sinh sản và phát triển.

---

# **II. NGUYÊN TẮC THIẾT KẾ**

Website cần tạo cảm giác như một **khu vườn sinh thái 3D**, trong đó học sinh có một bàn/khu vực quan sát ở trung tâm.

Giao diện cần ưu tiên:

* Trực quan.  
* Ít chữ trên màn hình tại cùng một thời điểm.  
* Vật thể 3D dễ nhận biết.  
* Kéo – thả tự nhiên.  
* Animation rõ ràng.  
* Có phản hồi ngay sau mỗi thao tác.  
* Các bước sau bị khóa cho đến khi bước trước hoàn thành.  
* Học sinh luôn biết mình đang ở giai đoạn nào.  
* Có thể quan sát lại các đối tượng bằng kính lúp.  
* Không để học sinh thực hiện sai trình tự của thí nghiệm.

---

# **III. BỐ CỤC TỔNG THỂ MÀN HÌNH**

Màn hình chia thành 4 khu vực chính:

## **1\. THANH TIẾN TRÌNH – PHÍA TRÊN**

Hiển thị toàn bộ chuỗi:

**BƯỚM ĐỰC \+ BƯỚM CÁI**  
**→ GIAO PHỐI**  
**→ THỤ TINH**  
**→ BƯỚM CÁI ĐẺ TRỨNG**  
**→ TRỨNG**  
**→ SÂU NON**  
**→ NHỘNG**  
**→ BƯỚM TRƯỞNG THÀNH**

Thanh tiến trình hoạt động theo nguyên tắc:

* Giai đoạn chưa thực hiện: mờ/khóa.  
* Giai đoạn hiện tại: nổi bật.  
* Giai đoạn hoàn thành: sáng/đã hoàn thành.  
* Giai đoạn phía sau: chưa cho phép tương tác.

---

# **2\. KHAY DỤNG CỤ – BÊN TRÁI**

Khu vực bên trái là:

**KHAY DỤNG CỤ**

Chỉ chứa những vật dụng mà học sinh trực tiếp kéo vào khu vực quan sát.

Các vật dụng:

1. Bướm đực 3D.  
2. Bướm cái 3D.  
3. Kính lúp 3D.  
4. Lá cây tươi 3D.  
5. Thước đo 3D.

Vật dụng trong khay phải có:

* Hình minh họa 3D.  
* Tên vật dụng.  
* Hiệu ứng hover.  
* Hiệu ứng nhấc vật thể khi kéo.  
* Hiệu ứng quay về vị trí cũ khi thả sai.

---

# **3\. KHU VỰC QUAN SÁT – TRUNG TÂM**

Khu vực trung tâm là:

**KHU VƯỜN SINH THÁI 3D**

Có:

* Chậu cây xanh.  
* Cành cây.  
* Lá cây lớn.  
* Các vùng lá có thể tương tác.  
* Vị trí bướm có thể đậu.  
* Vị trí bướm cái có thể đẻ trứng.  
* Vị trí sâu non có thể bò và ăn.  
* Vị trí sâu có thể hóa nhộng.  
* Vị trí nhộng bám trên cành.  
* Không gian sạch sẽ.  
* Ánh sáng tự nhiên.  
* Nền cảnh sinh thái nhẹ nhàng.

Camera chính nhìn chếch từ trên xuống để học sinh dễ quan sát toàn bộ khu vực.

---

# **4\. NÚT LÀM LẠI – GÓC DƯỚI PHẢI**

Luôn hiển thị:

**LÀM LẠI THÍ NGHIỆM**

Nút này hoạt động ở mọi thời điểm.

---

# **IV. NÚT “LÀM lại thí nghiệm”**

Khi học sinh nhấp:

**LÀM LẠI THÍ NGHIỆM**

Hiển thị hộp thoại xác nhận:

> **Em có chắc muốn làm lại thí nghiệm không?**

Hai nút:

**HỦY | LÀM LẠI**

---

## **4.1. Nếu chọn HỦY**

Hệ thống:

* Đóng hộp thoại.  
* Giữ nguyên toàn bộ tiến trình hiện tại.  
* Không thay đổi vật thể.  
* Không thay đổi trạng thái.  
* Không dừng timeline.  
* Không xóa các đối tượng đã tạo.  
* Không thay đổi vị trí các vật thể.

---

## **4.2. Nếu chọn LÀM LẠI**

Hệ thống thực hiện reset toàn bộ.

### **Dừng:**

* Timeline.  
* Animation phát triển.  
* Animation giao phối.  
* Animation đẻ trứng.  
* Animation sâu ăn.  
* Animation lột xác.  
* Animation hóa nhộng.  
* Animation vũ hóa.  
* Các hiệu ứng camera.

### **Đưa về trạng thái ban đầu:**

* Thời gian \= Ngày 0\.  
* Bướm đực → khay.  
* Bướm cái → khay.  
* Kính lúp → khay.  
* Lá cây → khay.  
* Thước đo → khay.

### **Xóa toàn bộ đối tượng phát triển:**

* Trạng thái giao phối.  
* Trạng thái thụ tinh.  
* Trứng.  
* Sâu non.  
* Các lớp da cũ sau lột xác.  
* Nhộng.  
* Vỏ nhộng.  
* Bướm mới vũ hóa.  
* Bướm trưởng thành phát triển từ nhộng.

### **Khôi phục môi trường:**

* Lá cây trở về trạng thái nguyên vẹn.  
* Không có dấu vết sâu ăn.  
* Cành cây trở về trạng thái ban đầu.  
* Tắt Mặt cắt 3D.  
* Camera trở về góc nhìn ban đầu.  
* Đóng mọi cửa sổ thông tin.  
* Xóa mọi thông báo.  
* Xóa mọi tooltip.  
* Đưa bàn quan sát về trạng thái ban đầu.

### **Thanh tiến trình:**

Trở về:

**BƯỚM ĐỰC \+ BƯỚM CÁI → GIAO PHỐI → THỤ TINH → BƯỚM CÁI ĐẺ TRỨNG → TRỨNG → SÂU NON → NHỘNG → BƯỚM TRƯỞNG THÀNH**

Chỉ bước đầu tiên được mở.

---

# **V. KHAY DỤNG CỤ**

## **5.1. BƯỚM ĐỰC 3D**

Tên:

**BƯỚM ĐỰC**

Đặc điểm:

* Bướm trưởng thành.  
* Mô hình 3D chân thật.  
* Có cánh.  
* Có chân.  
* Có râu.  
* Có chuyển động cánh nhẹ.  
* Có thể bay.  
* Có thể đậu trên cành.

Tương tác:

* Có thể kéo từ khay.  
* Có thể thả vào khu vực quan sát.  
* Có thể kéo đến gần bướm cái.  
* Có thể tự động bay đến vị trí phù hợp sau khi đặt đúng.

---

# **5.2. BƯỚM CÁI 3D**

Tên:

**BƯỚM CÁI**

Đặc điểm:

* Bướm trưởng thành.  
* Mô hình 3D chân thật.  
* Cánh chuyển động nhẹ.  
* Có thể bay.  
* Có thể đậu trên lá.  
* Có thể thực hiện animation đẻ trứng.

Tương tác:

* Kéo từ khay.  
* Đặt vào khu vực quan sát.  
* Sau thụ tinh, được phép đưa lên lá để đẻ trứng.

---

# **5.3. KÍNH LÚP 3D**

Tên:

**KÍNH LÚP**

Công dụng:

* Quan sát trứng.  
* Quan sát sâu non.  
* Quan sát nhộng.  
* Bật Mặt cắt 3D.  
* Quan sát sự biến đổi bên trong nhộng.

Kính lúp có thể kéo – thả.

Khi đặt đúng:

* Tạo vùng phóng đại.  
* Làm đối tượng bên dưới kính lớn hơn.  
* Làm chi tiết rõ hơn.  
* Hiển thị thông tin tương ứng.

---

# **5.4. LÁ CÂY TƯƠI 3D**

Tên:

**LÁ CÂY**

Công dụng:

* Là nơi bướm cái đẻ trứng.  
* Là thức ăn của sâu non.

Lá có trạng thái:

**LÁ NGUYÊN VẸN**

và

**LÁ BỊ SÂU ĂN**

Khi sâu ăn:

* Xuất hiện vết cắn.  
* Mép lá khuyết dần.  
* Diện tích lá giảm dần.  
* Sâu tiếp tục bò trên lá.

---

# **5.5. THƯỚC ĐO 3D**

Tên:

**THƯỚC ĐO**

Công dụng:

* Đo chiều dài sâu non.  
* Theo dõi sâu lớn lên.  
* So sánh kích thước qua các lần lột xác.

Khi đưa gần sâu:

* Thước tự căn chỉnh.  
* Thước nằm song song với thân sâu.  
* Hiển thị chiều dài.  
* Cập nhật theo kích thước sâu.

---

# **VI. GIAI ĐOẠN 0 – BƯỚM ĐỰC VÀ BƯỚM CÁI**

## **Mục tiêu**

Học sinh đưa bướm đực và bướm cái vào khu vực quan sát.

---

## **6.1. Kéo bướm đực**

Học sinh kéo:

**BƯỚM ĐỰC**

từ khay vào khu vực quan sát.

### **Thả đúng**

Nếu bướm được đặt trong vùng hợp lệ:

* Bướm bay nhẹ.  
* Đậu lên cành.  
* Cánh chuyển động nhẹ.  
* Hiển thị nhãn:

**BƯỚM ĐỰC**

Thông báo:

> **Bướm đực là bướm trưởng thành có khả năng tham gia sinh sản.**

### **Thả sai**

Hiển thị:

> **Hãy đặt bướm đực vào khu vực quan sát.**

Bướm quay về vị trí ban đầu.

---

# **6.2. Kéo bướm cái**

Học sinh kéo:

**BƯỚM CÁI**

vào khu vực quan sát.

### **Đúng**

* Bướm bay.  
* Đậu trên cành/lá.  
* Cánh chuyển động nhẹ.  
* Hiển thị:

**BƯỚM CÁI**

### **Sai**

Hiển thị:

> **Hãy đặt bướm cái vào khu vực quan sát.**

Bướm quay về khay.

---

# **6.3. Khi cả hai đã được đặt**

Hệ thống:

* Nhận diện đủ 2 đối tượng.  
* Bướm đực và bướm cái tự động bay đến gần nhau.  
* Hai bướm đậu trên cùng một cành.  
* Camera hơi phóng to.

Hiển thị:

**BƯỚM ĐỰC \+ BƯỚM CÁI**

Thông báo:

> **Bướm đực và bướm cái trưởng thành có thể sinh sản.**

Mở thao tác:

**ĐƯA BƯỚM ĐỰC ĐẾN GẦN BƯỚM CÁI**

---

# **VII. TƯƠNG TÁC GIAO PHỐI**

Học sinh kéo bướm đực đến gần bướm cái.

## **Khi đúng vị trí**

Hai bướm:

* Dừng lại.  
* Quay về hướng nhau.  
* Animation giao phối diễn ra ngắn.  
* Không mô tả chi tiết cơ quan sinh sản.  
* Có biểu tượng kết nối giữa hai cá thể.

Hiển thị:

**GIAO PHỐI**

Thông báo:

> **Bướm đực và bướm cái giao phối để thực hiện quá trình sinh sản.**

Thanh tiến trình:

**BƯỚM ĐỰC \+ BƯỚM CÁI ✓ → GIAO PHỐI ✓**

Sau khi animation kết thúc:

**GIAI ĐOẠN THỤ TINH** được mở.

---

## **Nếu kéo sai**

Nếu đưa bướm đực quá xa:

> **Hãy đưa bướm đực đến gần bướm cái.**

Bướm đực quay về vị trí gần nhất.

---

# **VIII. GIAI ĐOẠN 1 – THỤ TINH**

Sau khi giao phối hoàn thành, hệ thống chuyển sang màn hình/mô-đun mô phỏng thụ tinh.

Không mô tả chi tiết cơ quan sinh sản.

Hiển thị sơ đồ:

**TINH TRÙNG CỦA BƯỚM ĐỰC**

**\+**

**TRỨNG CỦA BƯỚM CÁI**

↓

**THỤ TINH**

---

## **8.1. Animation**

Trình tự:

1. Xuất hiện biểu tượng đại diện cho tinh trùng.  
2. Xuất hiện biểu tượng đại diện cho trứng.  
3. Tinh trùng di chuyển về phía trứng.  
4. Hai thành phần kết hợp.  
5. Hiệu ứng sáng nhẹ.  
6. Xuất hiện:

**TRỨNG ĐÃ THỤ TINH**

Thông báo:

> **Thụ tinh xảy ra khi tinh trùng của bướm đực kết hợp với trứng của bướm cái.**

Thanh tiến trình:

**THỤ TINH ✓**

---

# **IX. NÚT TIẾP TỤC SAU THỤ TINH**

Hiển thị:

**▶ TIẾP TỤC**

Khi nhấp:

* Màn hình chuyển về khu vườn.  
* Bướm cái xuất hiện trên cành.  
* Camera chuyển về khu vực lá.

Thông báo:

> **Sau khi thụ tinh, bướm cái chuẩn bị đẻ trứng trên lá cây.**

Mở:

**BƯỚM CÁI ĐẺ TRỨNG**

---

# **X. GIAI ĐOẠN 2 – BƯỚM CÁI ĐẺ TRỨNG**

Học sinh kéo:

**BƯỚM CÁI**

từ khay đến lá cây.

---

## **10.1. Đặt đúng**

Nếu thả vào vùng lá:

* Bướm tự động đậu trên mặt dưới lá.  
* Cánh rung nhẹ.  
* Bướm di chuyển nhẹ đến vị trí phù hợp.

Hiển thị:

> **Hãy quan sát bướm cái đẻ trứng trên lá cây.**

Sau đó tự động chạy animation.

---

## **10.2. Đặt sai**

Nếu thả ngoài vùng lá:

> **Hãy đặt bướm cái lên lá cây.**

Bướm quay về khay.

---

# **XI. ANIMATION BƯỚM CÁI ĐẺ TRỨNG**

Trình tự:

1. Bướm đậu ở mặt dưới lá.  
2. Bướm giữ vị trí ổn định.  
3. Cánh chuyển động nhẹ.  
4. Animation đẻ trứng diễn ra.  
5. Một cụm trứng nhỏ xuất hiện.  
6. Trứng bám trên mặt dưới lá.  
7. Bướm cái bay đi.

Hiển thị:

**TRỨNG**

Thông báo:

> **Bướm cái đẻ trứng trên mặt dưới của lá.**

Thanh tiến trình:

**BƯỚM CÁI ĐẺ TRỨNG ✓ → TRỨNG**

---

# **XII. GIAI ĐOẠN 3 – TRỨNG**

Mốc thời gian:

**NGÀY 0 → NGÀY 3**

Trứng xuất hiện thành một cụm nhỏ trên mặt dưới lá.

Đặc điểm hiển thị:

* Nhỏ.  
* Hình cầu.  
* Màu trắng đục.  
* Bám trên mặt dưới lá.

Hiển thị nhãn:

**TRỨNG BƯỚM**

---

# **XIII. DÙNG KÍNH LÚP QUAN SÁT TRỨNG**

Học sinh kéo:

**KÍNH LÚP**

đến cụm trứng.

---

## **13.1. Đúng**

Khi kính nằm trong vùng tương tác:

* Kính tự căn chỉnh.  
* Vùng dưới kính được phóng đại.  
* Trứng lớn hơn.  
* Chi tiết bề mặt trứng rõ hơn.

Hiển thị:

**TRỨNG BƯỚM**

Thông báo:

> **Trứng bướm rất nhỏ và bám trên mặt dưới lá.**

Đánh dấu:

**ĐÃ QUAN SÁT TRỨNG ✓**

Mở nút:

**▶ CHUYỂN SANG GIAI ĐOẠN NỞ**

---

## **13.2. Sai**

Nếu kính được đưa đến vị trí khác:

> **Hãy đưa kính lúp đến cụm trứng để quan sát.**

Kính quay về vị trí gần nhất.

---

# **XIV. CHUYỂN SANG GIAI ĐOẠN NỞ**

Học sinh nhấp:

**▶ CHUYỂN SANG GIAI ĐOẠN NỞ**

Hệ thống tua nhanh:

**NGÀY 3 → NGÀY 7**

---

## **NGÀY 3**

Trứng:

* Chuyển màu xám sẫm.  
* Bề mặt thay đổi.  
* Vỏ bắt đầu nứt.

Thông báo:

> **Trứng đang phát triển và chuẩn bị nở.**

---

## **NGÀY 7**

Animation:

1. Vỏ trứng nứt.  
2. Vết nứt mở rộng.  
3. Sâu non chui ra.  
4. Sâu non ăn phần vỏ trứng.  
5. Sâu bò tìm đến lá.

Thanh tiến trình:

**SÂU NON ✓**

---

# **XV. GIAI ĐOẠN 4 – SÂU NON / ẤU TRÙNG**

Hiển thị nhãn lớn:

**SÂU NON (ẤU TRÙNG)**

Đặc điểm:

* Không có cánh.  
* Cơ thể dạng sâu.  
* Có hàm gặm.  
* Bò trên lá.  
* Ăn nhiều lá.  
* Lớn nhanh.  
* Lột xác nhiều lần.

Thông báo:

> **Sâu non ăn rất nhiều lá cây, lớn nhanh và lột xác nhiều lần để tăng kích thước.**

---

# **XVI. TƯƠNG TÁC CHO SÂU NON ĂN**

Học sinh kéo:

**LÁ CÂY TƯƠI**

từ khay đến gần sâu.

---

## **16.1. Đúng**

Khi lá nằm trong vùng sâu có thể ăn:

1. Sâu quay về phía lá.  
2. Sâu bò đến.  
3. Sâu bắt đầu gặm.  
4. Animation gặm lá.  
5. Mép lá bắt đầu khuyết.  
6. Các phần lá nhỏ biến mất dần.  
7. Sâu ăn tiếp.  
8. Kích thước sâu tăng nhẹ.

Hiển thị:

> **Sâu non đang ăn lá.**

Đánh dấu:

**ĐÃ CHO SÂU ĂN ✓**

---

## **16.2. Sai**

Nếu lá nằm ngoài vùng:

> **Hãy đưa lá cây đến gần sâu non.**

Lá quay về khay.

---

# **XVII. SÂU NON LỚN LÊN**

Hệ thống mở timeline:

**LẦN 1 → LẦN 2 → LẦN 3**

Mỗi lần:

* Sâu dài hơn.  
* Thân lớn hơn.  
* Tiếp tục ăn lá.  
* Sau đó lột xác.

---

# **XVIII. ANIMATION LỘT XÁC**

Mỗi lần lột xác:

1. Sâu ngừng di chuyển.  
2. Sâu giảm hoạt động.  
3. Lớp da cũ bắt đầu tách.  
4. Sâu chui ra khỏi lớp da cũ.  
5. Cơ thể mới lớn hơn.  
6. Lớp da cũ nằm lại.  
7. Sâu tiếp tục bò và ăn.

Có thể hiển thị nhãn:

**LẦN LỘT XÁC 1**

**LẦN LỘT XÁC 2**

**LẦN LỘT XÁC 3**

---

# **XIX. DÙNG THƯỚC ĐO QUAN SÁT SÂU LỚN LÊN**

Học sinh kéo:

**THƯỚC ĐO 3D**

đến gần sâu.

## **Đúng**

Thước:

* Tự căn chỉnh theo chiều dài sâu.  
* Nằm song song với thân sâu.  
* Hiển thị số đo tương ứng.

Thông báo:

> **Chiều dài sâu non đang tăng lên.**

Sau mỗi lần lột xác, số đo được cập nhật.

Mục tiêu trực quan:

**SÂU NHỎ → SÂU LỚN HƠN → SÂU TRƯỞNG THÀNH**

---

## **Sai**

Nếu thước quá xa:

> **Hãy đưa thước đến gần sâu non để đo.**

Thước quay về vị trí gần nhất.

---

# **XX. SÂU NON HÓA NHỘNG**

Khi sâu phát triển đủ:

1. Sâu ngừng ăn.  
2. Sâu rời khỏi lá.  
3. Sâu bò lên cành.  
4. Sâu treo mình.  
5. Cơ thể tạo tư thế hình chữ J.  
6. Lột xác lần cuối.  
7. Xuất hiện lớp vỏ nhộng.

Hiển thị:

**NHỘNG**

Thông báo:

> **Sâu non đã hóa thành nhộng.**

Thanh tiến trình:

**SÂU NON ✓ → NHỘNG**

---

# **XXI. GIAI ĐOẠN 5 – NHỘNG**

Mốc thời gian:

**NGÀY 14 → NGÀY 18**

Nhộng:

* Cố định trên cành.  
* Gần như bất động bên ngoài.  
* Có lớp vỏ bao bọc.  
* Bên trong cơ thể tiếp tục biến đổi.

Hiển thị:

**NHỘNG**

Thông báo:

> **Bên ngoài nhộng bất động, nhưng bên trong cơ thể đang tiếp tục biến đổi.**

---

# **XXII. DÙNG KÍNH LÚP QUAN SÁT NHỘNG**

Học sinh kéo:

**KÍNH LÚP**

đến gần nhộng.

---

## **Đúng**

Khi kính đặt đúng:

* Kính tự căn chỉnh.  
* Camera phóng to nhộng.  
* Nhộng được làm nổi bật.  
* Mở nút:

**\[ MẶT CẮT 3D \]**

Đánh dấu:

**ĐÃ QUAN SÁT NHỘNG ✓**

---

## **Sai**

Hiển thị:

> **Hãy đưa kính lúp đến gần nhộng để quan sát.**

Kính quay lại vị trí gần nhất.

---

# **XXIII. MẶT CẮT 3D NHỘNG**

Học sinh nhấp:

**\[ MẶT CẮT 3D \]**

Hệ thống chuyển sang chế độ quan sát bên trong.

---

## **23.1. Hiệu ứng chuyển đổi**

Vỏ nhộng:

* Tách đôi theo chiều dọc,

hoặc

* Chuyển sang trạng thái trong suốt/mờ khoảng 70%.

Camera:

* Phóng to.  
* Tập trung vào phần bên trong.

Hiển thị:

**MẶT CẮT BÊN TRONG NHỘNG**

---

# **XXIV. CÁC BỘ PHẬN ĐANG HÌNH THÀNH**

Bên trong nhộng hiển thị:

* Cánh đang hình thành.  
* Mắt kép đang hình thành.  
* Chân khớp đang hình thành.  
* Vòi hút dạng xoắn ốc đang hình thành.

Các bộ phận cần có vùng click rõ ràng.

---

# **XXV. TƯƠNG TÁC NHẤP VÀO BỘ PHẬN**

## **25.1. Nhấp CÁNH**

Hiển thị:

**CÁNH ĐANG HÌNH THÀNH**

Có thể thêm hiệu ứng highlight quanh cánh.

---

## **25.2. Nhấp MẮT**

Hiển thị:

**MẮT KÉP ĐANG HÌNH THÀNH**

---

## **25.3. Nhấp CHÂN**

Hiển thị:

**CHÂN KHỚP ĐANG HÌNH THÀNH**

---

## **25.4. Nhấp VÒI**

Hiển thị:

**VÒI HÚT ĐANG HÌNH THÀNH**

---

## **25.5. Nhấp sai**

Nếu học sinh nhấp ngoài vùng các bộ phận:

> **Hãy nhấp vào bộ phận đang hình thành bên trong nhộng.**

---

# **XXVI. HOÀN THÀNH QUAN SÁT MẶT CẮT**

Học sinh cần quan sát các vùng bộ phận được yêu cầu.

Sau khi hoàn thành:

Hiển thị:

**ĐÃ QUAN SÁT BÊN TRONG NHỘNG ✓**

Mở nút:

**▶ TUA NHANH THỜI GIAN VŨ HÓA**

---

# **XXVII. TUA NHANH THỜI GIAN VŨ HÓA**

Học sinh nhấp:

**▶ TUA NHANH THỜI GIAN VŨ HÓA**

Hệ thống tua:

**NGÀY 18 → NGÀY 28**

---

## **Diễn biến**

Nhộng:

1. Khép lại.  
2. Vỏ thay đổi.  
3. Dần trong suốt.  
4. Bên trong xuất hiện hình dáng bướm.  
5. Vỏ bắt đầu nứt.

Thông báo:

> **Bướm đang chuẩn bị thoát khỏi vỏ nhộng.**

---

# **XXVIII. GIAI ĐOẠN 6 – BƯỚM TRƯỞNG THÀNH**

Vỏ nhộng nứt.

Animation:

1. Vỏ nhộng nứt.  
2. Bướm chui ra.  
3. Bướm bám vào cành.  
4. Cánh còn ẩm.  
5. Cánh nhăn.  
6. Bướm chưa thể bay.  
7. Cánh dần mở rộng.  
8. Cánh khô.  
9. Bướm xòe cánh.  
10. Bướm có thể bay.

Hiển thị:

**BƯỚM TRƯỞNG THÀNH**

Thông báo:

> **Bướm thoát khỏi vỏ nhộng, giương rộng đôi cánh khô ráo và có thể bay đi hút mật, bắt đầu vòng đời mới.**

---

# **XXIX. THANH TIẾN TRÌNH HOÀN THÀNH**

Thanh tiến trình sáng hoàn chỉnh:

**TRỨNG ✓ → SÂU NON ✓ → NHỘNG ✓ → BƯỚM TRƯỞNG THÀNH ✓**

Toàn bộ chuỗi:

**BƯỚM ĐỰC \+ BƯỚM CÁI**  
**→ GIAO PHỐI**  
**→ THỤ TINH**  
**→ BƯỚM CÁI ĐẺ TRỨNG**  
**→ TRỨNG**  
**→ SÂU NON**  
**→ NHỘNG**  
**→ BƯỚM TRƯỞNG THÀNH**

được đánh dấu hoàn thành.

---

# **XXX. HOẠT ĐỘNG SẮP XẾP VÒNG ĐỜI**

Sau khi bướm trưởng thành xuất hiện, mở hoạt động:

**SẮP XẾP VÒNG ĐỜI CỦA BƯỚM**

Hiển thị yêu cầu:

> **Hãy kéo các thẻ và sắp xếp đúng vòng đời của bướm.**

Có 4 thẻ:

**BƯỚM TRƯỞNG THÀNH**

**NHỘNG**

**TRỨNG**

**SÂU NON**

---

# **XXXI. KHU VỰC SẮP XẾP**

Có 4 vị trí trống:

**VỊ TRÍ 1 → VỊ TRÍ 2 → VỊ TRÍ 3 → VỊ TRÍ 4**

Học sinh kéo thẻ vào từng vị trí.

Thứ tự đúng:

**TRỨNG → SÂU NON → NHỘNG → BƯỚM TRƯỞNG THÀNH**

---

# **XXXII. KÉO ĐÚNG**

Khi toàn bộ thứ tự chính xác:

* Các thẻ sáng lên.  
* Có animation xác nhận.  
* Xuất hiện dấu ✓.  
* Thanh tiến trình hoàn thành.

Thông báo:

> **Chính xác\! Em đã sắp xếp đúng vòng đời của bướm.**

---

# **XXXIII. KÉO SAI**

Hiển thị:

> **Chưa đúng. Hãy kiểm tra lại thứ tự các giai đoạn phát triển.**

Thẻ đặt sai:

* Tự động quay về vị trí gần nhất,  
* hoặc trở về khu vực thẻ chưa sắp xếp.

Hệ thống đồng thời hiển thị gợi ý:

**TRỨNG → SÂU NON → NHỘNG → BƯỚM TRƯỞNG THÀNH**

---

# **XXXIV. THÔNG TIN TỔNG HỢP VÒNG ĐỜI**

Sau khi hoàn thành:

Hiển thị:

> **Bướm phát triển qua 4 giai đoạn: trứng, sâu non, nhộng và bướm trưởng thành. Bướm trưởng thành tiếp tục sinh sản, tạo ra thế hệ bướm mới.**

---

# **XXXV. SƠ ĐỒ TỔNG HỢP CUỐI THÍ NGHIỆM**

Hiển thị sơ đồ lớn ở trung tâm:

**BƯỚM ĐỰC \+ BƯỚM CÁI**

↓

**GIAO PHỐI**

↓

**THỤ TINH**

↓

**BƯỚM CÁI ĐẺ TRỨNG**

↓

**TRỨNG**

↓

**SÂU NON**

↓

**NHỘNG**

↓

**BƯỚM TRƯỞNG THÀNH**

↓

**TIẾP TỤC SINH SẢN**

↓

**THẾ HỆ BƯỚM MỚI**

Sơ đồ có animation chạy lần lượt theo chiều mũi tên.

---

# **XXXVI. LOGIC KHÓA/MỞ TOÀN BỘ THÍ NGHIỆM**

## **BƯỚC 1**

Chưa đặt đủ:

**BƯỚM ĐỰC \+ BƯỚM CÁI**

→ Không thể bắt đầu giao phối.

---

## **BƯỚC 2**

Đã đặt đủ 2 bướm nhưng chưa đưa bướm đực đến gần bướm cái:

→ Không kích hoạt giao phối.

---

## **BƯỚC 3**

Chưa hoàn thành giao phối:

→ Không mở thụ tinh.

---

## **BƯỚC 4**

Chưa hoàn thành thụ tinh:

→ Không cho phép thực hiện bước đẻ trứng.

---

## **BƯỚC 5**

Chưa đặt bướm cái đúng lên lá:

→ Không xuất hiện trứng.

---

## **BƯỚC 6**

Chưa có trứng:

→ Không mở giai đoạn quan sát trứng.

---

## **BƯỚC 7**

Chưa dùng kính lúp quan sát trứng:

→ Không mở:

**CHUYỂN SANG GIAI ĐOẠN NỞ**

---

## **BƯỚC 8**

Chưa chuyển sang giai đoạn nở:

→ Sâu non chưa xuất hiện.

---

## **BƯỚC 9**

Sâu non xuất hiện nhưng chưa được cho ăn:

→ Không kích hoạt đầy đủ quá trình lớn lên.

---

## **BƯỚC 10**

Sâu chưa đủ lớn:

→ Không chuyển thành nhộng.

---

## **BƯỚC 11**

Chưa có nhộng:

→ Không xuất hiện:

**MẶT CẮT 3D**

---

## **BƯỚC 12**

Có nhộng nhưng kính chưa đặt đúng:

→ Không mở:

**MẶT CẮT 3D**

---

## **BƯỚC 13**

Chưa bật Mặt cắt 3D:

→ Không được quan sát bên trong nhộng.

---

## **BƯỚC 14**

Chưa hoàn thành quan sát bên trong nhộng:

→ Không mở:

**TUA NHANH THỜI GIAN VŨ HÓA**

---

## **BƯỚC 15**

Chưa tua đến giai đoạn vũ hóa:

→ Không xuất hiện bướm trưởng thành.

---

## **BƯỚC 16**

Chưa có bướm trưởng thành:

→ Không mở hoạt động sắp xếp vòng đời.

---

## **BƯỚC 17**

Chưa sắp xếp đúng:

→ Chưa hoàn thành thí nghiệm.

---

# **XXXVII. QUY TẮC KÉO – THẢ CHUNG**

Tất cả vật dụng đều tuân thủ:

### **Khi bắt đầu kéo**

* Vật thể nổi lên.  
* Có hiệu ứng shadow.  
* Con trỏ chuyển trạng thái kéo.  
* Vật thể hơi phóng to.

### **Khi kéo đúng vùng**

* Vùng đích sáng nhẹ.  
* Hiển thị hiệu ứng cho phép thả.

### **Khi thả đúng**

* Vật thể tự căn chỉnh.  
* Chuyển sang trạng thái tương tác.  
* Kích hoạt logic tiếp theo.

### **Khi thả sai**

* Hiển thị thông báo hướng dẫn.  
* Vật thể quay về vị trí ban đầu/gần nhất.  
* Không thay đổi tiến trình.

---

# **XXXVIII. HỆ THỐNG THÔNG BÁO**

Thông báo phải ngắn, dễ đọc và đặt gần đối tượng đang thao tác.

Các thông báo chính:

**Hãy đặt bướm vào khu vực quan sát.**

**Hãy đưa bướm đực đến gần bướm cái.**

**Bướm đực và bướm cái giao phối để thực hiện quá trình sinh sản.**

**Thụ tinh xảy ra khi tinh trùng của bướm đực kết hợp với trứng của bướm cái.**

**Hãy đặt bướm cái lên lá cây.**

**Bướm cái đẻ trứng trên mặt dưới của lá.**

**Hãy đưa kính lúp đến cụm trứng để quan sát.**

**Trứng đang phát triển và chuẩn bị nở.**

**Sâu non đang ăn lá.**

**Hãy đưa lá cây đến gần sâu non.**

**Chiều dài sâu non đang tăng lên.**

**Hãy đưa thước đến gần sâu non để đo.**

**Sâu non đã hóa thành nhộng.**

**Hãy đưa kính lúp đến gần nhộng để quan sát.**

**Hãy nhấp vào bộ phận đang hình thành bên trong nhộng.**

**Bướm đang chuẩn bị thoát khỏi vỏ nhộng.**

**Chính xác\! Em đã sắp xếp đúng vòng đời của bướm.**

**Chưa đúng. Hãy kiểm tra lại thứ tự các giai đoạn phát triển.**

---

# **XXXIX. CAMERA**

Camera cần thay đổi theo từng giai đoạn.

## **Giai đoạn bướm**

Camera toàn cảnh khu vườn.

## **Giai đoạn giao phối**

Camera zoom nhẹ vào hai bướm.

## **Giai đoạn đẻ trứng**

Camera tập trung vào lá.

## **Giai đoạn trứng**

Camera zoom vào mặt dưới lá.

## **Kính lúp**

Camera giữ ổn định và tạo vùng phóng đại.

## **Giai đoạn sâu**

Camera theo dõi vùng lá nơi sâu bò.

## **Đo sâu**

Camera tập trung vào sâu và thước.

## **Hóa nhộng**

Camera chuyển theo sâu từ lá lên cành.

## **Nhộng**

Camera tập trung vào nhộng.

## **Mặt cắt 3D**

Camera zoom sâu vào bên trong nhộng.

## **Vũ hóa**

Camera cố định tại vị trí nhộng.

## **Bướm trưởng thành**

Camera zoom nhẹ ra để nhìn toàn bộ bướm.

## **Sắp xếp vòng đời**

Camera chuyển sang giao diện bài tập trung tâm.

---

# **XL. HỆ THỐNG THỜI GIAN**

Timeline tổng:

**NGÀY 0**

↓

**NGÀY 3**

↓

**NGÀY 7**

↓

**NGÀY 14**

↓

**NGÀY 18**

↓

**NGÀY 28**

Timeline không cần chạy theo thời gian thực.

Có thể sử dụng tua nhanh để học sinh quan sát những thay đổi quan trọng.

---

# **XLI. CÁC MỐC THỜI GIAN**

## **NGÀY 0**

* Bướm trưởng thành.  
* Giao phối.  
* Thụ tinh.  
* Bướm cái chuẩn bị đẻ trứng.  
* Trứng bắt đầu hình thành sau khi đẻ.

## **NGÀY 3**

* Trứng phát triển.  
* Trứng sẫm màu.  
* Vỏ bắt đầu thay đổi.

## **NGÀY 7**

* Trứng nở.  
* Sâu non xuất hiện.

## **NGÀY 14**

* Sâu phát triển.  
* Sau các lần ăn và lột xác, sâu chuyển sang giai đoạn hóa nhộng.

## **NGÀY 18**

* Nhộng tiếp tục biến đổi bên trong.

## **NGÀY 28**

* Nhộng nứt.  
* Bướm trưởng thành xuất hiện.

---

# **XLII. TRẠNG THÁI CỦA BƯỚM**

Bướm đực:

**TRONG KHAY**  
**→ ĐANG KÉO**  
**→ ĐÃ ĐẶT**  
**→ ĐẬU TRÊN CÀNH**  
**→ THAM GIA GIAO PHỐI**

Bướm cái:

**TRONG KHAY**  
**→ ĐÃ ĐẶT**  
**→ ĐẬU TRÊN CÀNH**  
**→ SAU THỤ TINH**  
**→ ĐẬU TRÊN LÁ**  
**→ ĐẺ TRỨNG**  
**→ BAY ĐI**

---

# **XLIII. TRẠNG THÁI CỦA TRỨNG**

**CHƯA CÓ**

↓

**TRỨNG MỚI ĐẺ**

↓

**TRỨNG ĐANG PHÁT TRIỂN**

↓

**TRỨNG SẮP NỞ**

↓

**TRỨNG NỨT**

↓

**TRỨNG ĐÃ NỞ**

---

# **XLIV. TRẠNG THÁI CỦA SÂU**

**CHƯA XUẤT HIỆN**

↓

**SÂU NON NHỎ**

↓

**SÂU LỚN LẦN 1**

↓

**SÂU LỚN LẦN 2**

↓

**SÂU LỚN LẦN 3**

↓

**SÂU ĐỦ LỚN**

↓

**HÓA NHỘNG**

---

# **XLV. TRẠNG THÁI CỦA NHỘNG**

**CHƯA CÓ**

↓

**NHỘNG MỚI**

↓

**NHỘNG PHÁT TRIỂN**

↓

**ĐƯỢC QUAN SÁT BÊN TRONG**

↓

**SẮP VŨ HÓA**

↓

**VỎ NHỘNG NỨT**

↓

**BƯỚM CHUI RA**

---

# **XLVI. TRẠNG THÁI CỦA BƯỚM MỚI VŨ HÓA**

**TRONG VỎ NHỘNG**

↓

**VỪA CHUI RA**

↓

**CÁNH ẨM**

↓

**CÁNH NHĂN**

↓

**CÁNH MỞ RỘNG**

↓

**CÁNH KHÔ**

↓

**BƯỚM TRƯỞNG THÀNH**

---

# **XLVII. HỆ THỐNG PHẢN HỒI**

Có 3 cấp phản hồi:

## **1\. ĐÚNG**

* Hiệu ứng sáng nhẹ.  
* Dấu ✓.  
* Thông báo xác nhận.  
* Mở bước tiếp theo.

## **2\. SAI**

* Hiệu ứng rung nhẹ.  
* Thông báo hướng dẫn.  
* Vật thể quay lại vị trí trước.

## **3\. CHƯA ĐỦ ĐIỀU KIỆN**

Nút bị khóa.

Khi hover/click:

> **Hãy hoàn thành bước trước để tiếp tục.**

---

# **XLVIII. THANH TIẾN TRÌNH**

Thanh tiến trình gồm:

1. BƯỚM ĐỰC \+ BƯỚM CÁI  
2. GIAO PHỐI  
3. THỤ TINH  
4. BƯỚM CÁI ĐẺ TRỨNG  
5. TRỨNG  
6. SÂU NON  
7. NHỘNG  
8. BƯỚM TRƯỞNG THÀNH

Mỗi bước có 3 trạng thái:

### **LOCKED**

* Mờ.  
* Không click.  
* Không tương tác.

### **ACTIVE**

* Nổi bật.  
* Có animation nhẹ.  
* Học sinh được phép thực hiện.

### **COMPLETED**

* Sáng.  
* Có dấu ✓.  
* Có thể hiển thị lại thông tin.

---

# **XLIX. LOGIC STATE MACHINE**

Có thể triển khai theo các trạng thái:

INITIAL  
↓  
PLACE\_MALE  
↓  
PLACE\_FEMALE  
↓  
READY\_FOR\_MATING  
↓  
MATING  
↓  
FERTILIZATION  
↓  
READY\_FOR\_EGG\_LAYING  
↓  
EGG\_LAYING  
↓  
EGG\_OBSERVATION  
↓  
EGG\_HATCHING  
↓  
LARVA  
↓  
LARVA\_FEEDING  
↓  
LARVA\_GROWING  
↓  
PUPATION  
↓  
PUPA\_OBSERVATION  
↓  
PUPA\_3D\_CUTAWAY  
↓  
METAMORPHOSIS  
↓  
ADULT\_BUTTERFLY  
↓  
LIFE\_CYCLE\_SORTING  
↓  
COMPLETED

---

# **L. CÁC BIẾN TRẠNG THÁI ĐỀ XUẤT CHO DEVELOPER**

Có thể quản lý bằng các biến:

malePlaced  
femalePlaced  
matingCompleted  
fertilizationCompleted  
femaleReadyToLay  
eggLaid  
eggObserved  
hatchingStarted  
larvaAppeared  
larvaFed  
growthStage  
moltingCount  
pupaFormed  
pupaObserved  
cutawayEnabled  
cutawayObserved  
metamorphosisStarted  
adultButterflyAppeared  
lifeCycleSorted  
experimentCompleted

Biến thời gian:

currentDay  
timelineStage

Trạng thái dụng cụ:

magnifierTarget  
rulerTarget  
leafTarget

---

# **LI. LOGIC RESET ĐỀ XUẤT**

Khi người dùng xác nhận reset:

stopAllAnimations()

currentDay \= 0

malePlaced \= false  
femalePlaced \= false  
matingCompleted \= false  
fertilizationCompleted \= false  
femaleReadyToLay \= false  
eggLaid \= false  
eggObserved \= false  
hatchingStarted \= false  
larvaAppeared \= false  
larvaFed \= false  
growthStage \= 0  
moltingCount \= 0  
pupaFormed \= false  
pupaObserved \= false  
cutawayEnabled \= false  
cutawayObserved \= false  
metamorphosisStarted \= false  
adultButterflyAppeared \= false  
lifeCycleSorted \= false  
experimentCompleted \= false

Sau đó:

returnMaleToTray()  
returnFemaleToTray()  
returnMagnifierToTray()  
returnLeafToTray()  
returnRulerToTray()

removeEggs()  
removeLarva()  
removePupa()  
removePupaShell()  
removeNewButterfly()  
restoreLeaves()

closeAllInformationPanels()  
clearNotifications()  
resetCamera()  
resetProgressBar()  
lockAllFutureStages()  
activateInitialStage()

---

# **LII. QUY TẮC RESET BẮT BUỘC**

Reset phải đưa website về trạng thái giống hệt lần đầu mở thí nghiệm.

Không được xảy ra trường hợp:

* Trứng vẫn còn.  
* Lá vẫn bị ăn.  
* Sâu vẫn còn.  
* Nhộng vẫn còn.  
* Bướm trưởng thành vẫn còn.  
* Mặt cắt 3D vẫn mở.  
* Timeline vẫn đang chạy.  
* Thanh tiến trình vẫn sáng.  
* Nút giai đoạn sau vẫn mở.  
* Thông báo cũ vẫn tồn tại.  
* Camera vẫn ở chế độ zoom.

---

# **LIII. HOẠT ĐỘNG CUỐI**

Sau khi sắp xếp đúng vòng đời, hiển thị:

**HOÀN THÀNH THÍ NGHIỆM**

và:

> **Em đã quan sát được quá trình sinh sản và vòng đời của bướm.**

Sau đó hiển thị sơ đồ:

**BƯỚM ĐỰC \+ BƯỚM CÁI**  
**→ GIAO PHỐI**  
**→ THỤ TINH**  
**→ ĐẺ TRỨNG**  
**→ TRỨNG**  
**→ SÂU NON**  
**→ NHỘNG**  
**→ BƯỚM TRƯỞNG THÀNH**  
**→ TIẾP TỤC SINH SẢN**

---

# **LIV. KẾT LUẬN HIỂN THỊ CUỐI**

Hiển thị một bảng kết luận:

## **KẾT LUẬN**

> **Bướm là động vật đẻ trứng. Trong quá trình sinh sản, bướm đực và bướm cái giao phối, sau đó xảy ra thụ tinh. Bướm cái đẻ trứng trên lá cây.**

> **Bướm phát triển qua 4 giai đoạn: trứng → sâu non → nhộng → bướm trưởng thành. Bướm trưởng thành tiếp tục sinh sản, tạo ra thế hệ bướm mới.**

---

# **LV. FLOW HOÀN CHỈNH CỦA HỌC SINH**

MỞ THÍ NGHIỆM  
        ↓  
ĐẶT BƯỚM ĐỰC  
        ↓  
ĐẶT BƯỚM CÁI  
        ↓  
ĐƯA BƯỚM ĐỰC ĐẾN GẦN BƯỚM CÁI  
        ↓  
GIAO PHỐI  
        ↓  
THỤ TINH  
        ↓  
TIẾP TỤC  
        ↓  
ĐẶT BƯỚM CÁI LÊN LÁ  
        ↓  
BƯỚM CÁI ĐẺ TRỨNG  
        ↓  
QUAN SÁT TRỨNG BẰNG KÍNH LÚP  
        ↓  
CHUYỂN SANG GIAI ĐOẠN NỞ  
        ↓  
NGÀY 3  
        ↓  
NGÀY 7  
        ↓  
TRỨNG NỞ  
        ↓  
SÂU NON XUẤT HIỆN  
        ↓  
CHO SÂU ĂN LÁ  
        ↓  
SÂU LỚN  
        ↓  
LỘT XÁC LẦN 1  
        ↓  
LỘT XÁC LẦN 2  
        ↓  
LỘT XÁC LẦN 3  
        ↓  
SÂU ĐỦ LỚN  
        ↓  
HÓA NHỘNG  
        ↓  
ĐƯA KÍNH LÚP ĐẾN NHỘNG  
        ↓  
MẶT CẮT 3D  
        ↓  
QUAN SÁT CÁNH  
        ↓  
QUAN SÁT MẮT  
        ↓  
QUAN SÁT CHÂN  
        ↓  
QUAN SÁT VÒI  
        ↓  
TUA NHANH THỜI GIAN VŨ HÓA  
        ↓  
VỎ NHỘNG NỨT  
        ↓  
BƯỚM CHUI RA  
        ↓  
CÁNH KHÔ  
        ↓  
BƯỚM TRƯỞNG THÀNH  
        ↓  
SẮP XẾP VÒNG ĐỜI  
        ↓  
TRỨNG → SÂU NON → NHỘNG → BƯỚM TRƯỞNG THÀNH  
        ↓  
SƠ ĐỒ TỔNG HỢP  
        ↓  
KẾT LUẬN  
        ↓  
HOÀN THÀNH

---

# **LVI. CHECKLIST CHO DEVELOPER**

## **Giao diện**

* Khu vườn 3D.  
* Khay dụng cụ bên trái.  
* Thanh tiến trình phía trên.  
* Nút Làm lại luôn hiển thị.  
* Khu vực thông báo.  
* Camera tương tác.

## **Đối tượng**

* Bướm đực 3D.  
* Bướm cái 3D.  
* Kính lúp 3D.  
* Lá cây 3D.  
* Thước đo 3D.  
* Trứng.  
* Sâu non.  
* Da cũ sau lột xác.  
* Nhộng.  
* Vỏ nhộng.  
* Bướm mới vũ hóa.  
* Bướm trưởng thành.

## **Animation**

* Bướm bay.  
* Bướm đậu.  
* Giao phối.  
* Thụ tinh.  
* Đẻ trứng.  
* Trứng phát triển.  
* Trứng nở.  
* Sâu bò.  
* Sâu ăn lá.  
* Lá bị ăn.  
* Sâu lớn.  
* Sâu lột xác.  
* Sâu hóa nhộng.  
* Mặt cắt 3D.  
* Bộ phận bên trong nhộng.  
* Nhộng nứt.  
* Bướm chui ra.  
* Cánh khô.  
* Bướm trưởng thành bay.

## **Tương tác**

* Drag bướm đực.  
* Drag bướm cái.  
* Ghép bướm.  
* Quan sát thụ tinh.  
* Đặt bướm cái lên lá.  
* Quan sát trứng bằng kính.  
* Cho sâu ăn.  
* Đo sâu bằng thước.  
* Quan sát nhộng bằng kính.  
* Bật Mặt cắt 3D.  
* Click bộ phận bên trong nhộng.  
* Tua nhanh vũ hóa.  
* Sắp xếp vòng đời.

## **Logic**

* Khóa các bước phía sau.  
* Mở từng bước theo điều kiện.  
* Drag sai trả về vị trí cũ.  
* Không thể bỏ qua bước.  
* Timeline chỉ chạy khi được phép.  
* Mặt cắt chỉ mở khi kính đặt đúng.  
* Vũ hóa chỉ mở sau khi quan sát nhộng.  
* Sắp xếp vòng đời chỉ mở khi bướm trưởng thành xuất hiện.  
* Hoàn thành chỉ khi sắp xếp đúng.  
* Reset hoạt động ở mọi thời điểm.

---

# **LVII. YÊU CẦU QUAN TRỌNG VỀ TÍNH NHẤT QUÁN**

Toàn bộ website phải sử dụng thống nhất chuỗi:

**BƯỚM ĐỰC \+ BƯỚM CÁI**  
**→ GIAO PHỐI**  
**→ THỤ TINH**  
**→ BƯỚM CÁI ĐẺ TRỨNG**  
**→ TRỨNG**  
**→ SÂU NON**  
**→ NHỘNG**  
**→ BƯỚM TRƯỞNG THÀNH**  
**→ TIẾP TỤC SINH SẢN**

Không được để:

* Thanh tiến trình hiển thị khác.  
* Nội dung thông báo hiển thị khác.  
* Timeline hiển thị sai giai đoạn.  
* Nút chuyển bước xuất hiện trước điều kiện.  
* Sâu xuất hiện trước khi trứng nở.  
* Nhộng xuất hiện trước khi sâu phát triển.  
* Bướm trưởng thành xuất hiện trước khi hoàn thành giai đoạn nhộng.  
* Hoạt động sắp xếp vòng đời mở quá sớm.

---

# **LVIII. TRẠNG THÁI HOÀN THÀNH CUỐI CÙNG**

Khi học sinh hoàn thành:

Màn hình cuối hiển thị đồng thời:

### **TIÊU ĐỀ**

**HOÀN THÀNH THÍ NGHIỆM**

### **SƠ ĐỒ**

**BƯỚM ĐỰC \+ BƯỚM CÁI**  
**→ GIAO PHỐI**  
**→ THỤ TINH**  
**→ ĐẺ TRỨNG**  
**→ TRỨNG**  
**→ SÂU NON**  
**→ NHỘNG**  
**→ BƯỚM TRƯỞNG THÀNH**  
**→ TIẾP TỤC SINH SẢN**

### **THÔNG ĐIỆP**

> **Em đã quan sát được sự sinh sản và vòng đời của bướm từ khi bướm trưởng thành sinh sản cho đến khi hình thành bướm trưởng thành mới.**

### **KẾT LUẬN**

> **Bướm đẻ trứng và phát triển qua 4 giai đoạn: trứng, sâu non, nhộng và bướm trưởng thành. Bướm trưởng thành tiếp tục sinh sản, tạo thành một vòng đời mới.**

Nút:

**LÀM LẠI THÍ NGHIỆM**

vẫn luôn hoạt động để học sinh có thể thực hiện lại toàn bộ thí nghiệm từ đầu.

# **KẾT THÚC ĐẶC TẢ**

# THÍ NGHIỆM 8

# ĐẶC TẢ WEBSITE THÍ NGHIỆM

## THÍ NGHIỆM TÌM HIỂU SỰ SINH SẢN VÀ VÒNG ĐỜI CỦA ĐỘNG VẬT ĐẺ CON – MÈO

# ---

# I. MỤC TIÊU CỦA THÍ NGHIỆM

# Website mô phỏng quá trình sinh sản và vòng đời của mèo dưới dạng thí nghiệm tương tác 3D.

# Học sinh thực hiện lần lượt các thao tác:

# Đặt mèo đực → Đặt mèo cái → Xác định mèo đực/mèo cái → Tìm hiểu tinh trùng và trứng → Thực hiện thụ tinh → Quan sát hợp tử → Theo dõi hợp tử phát triển thành phôi → Phôi phát triển thành thai → Mèo con được sinh ra → Quan sát mèo con → Theo dõi mèo con lớn dần → Mèo phát triển thành mèo trưởng thành → Sắp xếp lại toàn bộ quá trình.

# Mục tiêu cuối cùng là giúp học sinh nhận biết:

* # Mèo là động vật đẻ con.

* # Mèo đực tạo ra tinh trùng.

* # Mèo cái tạo ra trứng.

* # Tinh trùng kết hợp với trứng xảy ra thụ tinh.

* # Sau thụ tinh hình thành hợp tử.

* # Hợp tử phân chia và phát triển thành phôi.

* # Phôi tiếp tục phát triển thành thai trong cơ thể mèo mẹ.

* # Khi phát triển đầy đủ, mèo con được sinh ra.

* # Mèo con tiếp tục lớn lên.

* # Kích thước cơ thể và khả năng vận động tăng dần.

* # Mèo con phát triển thành mèo trưởng thành.

* # Học sinh có thể sắp xếp đúng trình tự sinh sản và phát triển của mèo.

# ---

# II. NGUYÊN TẮC GIAO DIỆN CHUNG

## 2.1. Phong cách hình ảnh

# Toàn bộ website sử dụng phong cách:

* # 3D chân thật nhưng thân thiện với học sinh.

* # Màu sắc sáng, sạch, dễ quan sát.

* # Không sử dụng hình ảnh gây sợ hãi hoặc quá chi tiết về cơ thể bên trong.

* # Các bộ phận sinh sản được thể hiện dưới dạng mô phỏng khoa học đơn giản.

* # Chuyển động mềm mại.

* # Không sử dụng hiệu ứng nhấp nháy quá mạnh.

* # Không làm giao diện quá nhiều chi tiết gây phân tán sự chú ý.

## 2.2. Bố cục màn hình

# Màn hình chính chia thành 3 khu vực:

### KHU VỰC 1 – KHAY DỤNG CỤ

# Nằm cố định ở bên trái.

# Chứa:

* # Mèo đực.

* # Mèo cái.

* # Kính phóng đại.

# Khay dụng cụ luôn giữ nguyên vị trí.

### KHU VỰC 2 – KHU VỰC THÍ NGHIỆM

# Nằm ở trung tâm.

# Bao gồm:

* # Bàn quan sát.

* # Mèo đực.

* # Mèo cái.

* # Các mô hình sinh sản.

* # Khu vực mô phỏng bên trong cơ thể.

* # Khu vực quan sát phóng đại.

### KHU VỰC 3 – THÔNG TIN VÀ ĐIỀU KHIỂN

# Bao gồm:

* # Thanh tiến trình phía trên.

* # Nội dung hướng dẫn.

* # Thông tin quan sát.

* # Nút thực hiện bước tiếp theo.

* # Nút xem lại nếu giai đoạn đã hoàn thành.

# ---

# III. NÚT “LÀM LẠI THÍ NGHIỆM”

## 3.1. Vị trí

# Luôn hiển thị ở góc dưới bên phải màn hình.

# Nhãn:

# LÀM LẠI THÍ NGHIỆM

# Nút cần:

* # đủ lớn;

* # dễ nhìn;

* # dễ nhấp;

* # không bị che bởi khu vực thao tác;

* # luôn hoạt động trong toàn bộ thí nghiệm.

# ---

## 3.2. Khi học sinh nhấp nút

# Hiển thị hộp thoại xác nhận:

# “Em có chắc muốn làm lại thí nghiệm không?”

# Hai nút:

# HỦY | LÀM LẠI

# ---

## 3.3. Nếu chọn HỦY

# Hệ thống:

* # đóng hộp thoại;

* # không thay đổi dữ liệu;

* # giữ nguyên giai đoạn hiện tại;

* # giữ nguyên các vật thể;

* # giữ nguyên tiến trình;

* # giữ nguyên các mốc thời gian đã mở;

* # giữ nguyên các kết quả quan sát.

# ---

## 3.4. Nếu chọn LÀM LẠI

# Hệ thống thực hiện reset toàn bộ.

### Reset nội dung

1. # Xóa toàn bộ kết quả quan sát.

2. # Xóa các trạng thái đã xác định.

3. # Xóa toàn bộ thông tin đang hiển thị.

4. # Xóa các thông báo tạm thời.

5. # Dừng toàn bộ hoạt ảnh.

6. # Dừng toàn bộ mô phỏng đang chạy.

7. # Đưa thời gian về Ngày 0\.

### Reset sinh vật

8. # Đưa mèo đực về trạng thái ban đầu.

9. # Đưa mèo cái về trạng thái ban đầu.

10. # Xóa tinh trùng.

11. # Xóa trứng.

12. # Xóa trạng thái thụ tinh.

13. # Xóa hợp tử.

14. # Xóa phôi.

15. # Xóa thai.

16. # Xóa mèo con.

17. # Xóa các phiên bản mèo con theo từng giai đoạn phát triển.

18. # Xóa mèo trưởng thành được tạo ra trong mô phỏng.

### Reset dụng cụ

19. # Đưa kính phóng đại về khay dụng cụ.

20. # Đưa tất cả vật dụng về vị trí ban đầu.

21. # Đưa bàn quan sát về trạng thái trống.

### Reset tiến trình

22. # Đưa thanh tiến trình về bước đầu tiên.

23. # Đánh dấu tất cả các bước là chưa hoàn thành.

24. # Khóa tất cả các bước chưa được thực hiện.

25. # Khóa nút bắt đầu cho đến khi đặt đúng mèo đực và mèo cái.

# Sau khi reset, website trở về đúng trạng thái ban đầu.

# ---

# IV. KHAY DỤNG CỤ CỐ ĐỊNH

## 4.1. Mèo đực

# Mô hình:

# MÈO ĐỰC

# Đặc điểm:

* # mô hình 3D;

* # mèo trưởng thành;

* # hình dáng tự nhiên;

* # đứng hoặc ngồi tự nhiên;

* # cơ thể khỏe mạnh;

* # kích thước phù hợp với giao diện;

* # có thể kéo bằng chuột hoặc thao tác cảm ứng.

### Khi nhấp vào mèo đực

# Hiển thị bảng thông tin:

| Thông tin | Nội dung |
| ----- | ----- |
| Loài | Mèo |
| Giới tính | Đực |
| Giai đoạn | Trưởng thành |
| Tình trạng | Khỏe mạnh |

# ---

# 4.2. Mèo cái

# Mô hình:

# MÈO CÁI

# Đặc điểm:

* # mô hình 3D;

* # mèo trưởng thành;

* # hình dáng tự nhiên;

* # cơ thể khỏe mạnh;

* # kích thước tương đương mèo đực.

### Khi nhấp vào mèo cái

# Hiển thị:

| Thông tin | Nội dung |
| ----- | ----- |
| Loài | Mèo |
| Giới tính | Cái |
| Giai đoạn | Trưởng thành |
| Tình trạng | Khỏe mạnh |

# ---

# 4.3. Kính phóng đại

# Mô hình:

# KÍNH PHÓNG ĐẠI

# Kính có thể kéo từ khay vào khu vực thí nghiệm.

# Kính được sử dụng để quan sát:

* # mèo đực;

* # mèo cái;

* # tinh trùng;

* # trứng;

* # hợp tử;

* # phôi;

* # thai;

* # mèo con;

* # mèo con ở các giai đoạn phát triển.

## Khi đặt kính đúng

# Thực hiện:

1. # Vùng dưới kính được phóng đại.

2. # Đối tượng trở nên rõ hơn.

3. # Đối tượng có viền sáng nhẹ.

4. # Hiển thị bảng thông tin quan sát.

5. # Ghi nhận rằng học sinh đã quan sát đúng đối tượng.

## Khi đặt kính sai

# Hiển thị:

# “Hãy đưa kính đến gần đối tượng cần quan sát.”

# Sau đó:

* # kính quay về vị trí gần nhất;

* # không mất tiến trình;

* # không đánh dấu hoàn thành.

## Quy tắc

# Kính là dụng cụ quan sát.

# Kính không:

* # mở khóa bước;

* # thay đổi vật thể;

* # tạo ra vật thể;

* # làm mất tiến trình;

* # thay đổi timeline.

# ---

# V. NÚT BẮT ĐẦU QUAN SÁT

# Nút:

# ▶ BẮT ĐẦU QUAN SÁT SỰ SINH SẢN VÀ VÒNG ĐỜI

## Trạng thái ban đầu

# Nút ở trạng thái:

# KHÓA

# Có thể sử dụng hiệu ứng:

* # màu xám;

* # biểu tượng ổ khóa;

* # không thể nhấp.

## Điều kiện mở

# Chỉ mở khi:

# MÈO ĐỰC đã đặt đúng

# và

# MÈO CÁI đã đặt đúng

# Khi đủ điều kiện:

* # nút sáng lên;

* # biểu tượng khóa biến mất;

* # có hiệu ứng xuất hiện nhẹ;

* # học sinh có thể nhấp.

# ---

# VI. BÀN QUAN SÁT

# Bàn quan sát đặt ở trung tâm.

# Thiết kế:

* # bàn gỗ;

* # sạch sẽ;

* # không có vật dụng thừa;

* # không gian gia đình hoặc sân vườn;

* # đủ ánh sáng;

* # nền không quá nhiều chi tiết.

# Bàn có vùng thả được xác định rõ.

# Có thể sử dụng:

* # vòng sáng;

* # vùng đổ bóng;

* # vùng đánh dấu vị trí đặt mèo.

# ---

# VII. THANH TIẾN TRÌNH

# Thanh tiến trình nằm phía trên khu vực thí nghiệm.

# Nội dung:

# MÈO ĐỰC \+ MÈO CÁI → TINH TRÙNG \+ TRỨNG → THỤ TINH → HỢP TỬ → PHÔI → THAI → MÈO CON → MÈO CON LỚN DẦN → MÈO TRƯỞNG THÀNH

## Trạng thái

### Chưa thực hiện

* # màu trung tính;

* # khóa;

* # không thể truy cập.

### Đang thực hiện

* # sáng;

* # có điểm nhấn;

* # hiển thị rõ giai đoạn hiện tại.

### Đã hoàn thành

* # sáng rõ;

* # xuất hiện dấu ✓.

### Giai đoạn tiếp theo

# Chỉ mở sau khi giai đoạn trước hoàn thành.

# ---

# VIII. GIAI ĐOẠN CHUẨN BỊ

## BƯỚC 1 – ĐẶT MÈO ĐỰC

# Hướng dẫn:

# “Hãy kéo mèo đực vào khu vực quan sát.”

# Học sinh kéo mèo đực từ khay lên bàn.

### Nếu đúng

# Mèo đực:

* # tự động căn vào vị trí;

* # đứng/ngồi đúng tư thế;

* # có vòng sáng nhẹ.

# Thông báo:

# “Đã đặt mèo đực.”

# Ghi nhận:

# malePlaced \= true

### Nếu sai

# Thông báo:

# “Hãy đặt mèo đực vào khu vực quan sát.”

# Mèo đực:

* # tự động quay về khay;

* # không mất tiến trình khác.

# ---

# IX. BƯỚC 2 – ĐẶT MÈO CÁI

# Hướng dẫn:

# “Hãy kéo mèo cái lên bàn quan sát và đặt cạnh mèo đực.”

### Nếu đúng

# Mèo cái:

* # tự động căn vị trí;

* # đứng cạnh mèo đực;

* # có vòng sáng nhẹ.

# Thông báo:

# “Đã đặt mèo cái. Hai con mèo đã được đặt đúng vị trí.”

# Ghi nhận:

# femalePlaced \= true

### Nếu sai

# Hiển thị:

# “Hãy đặt mèo cái vào khu vực quan sát.”

# Mèo cái quay lại khay.

# ---

# X. ĐIỀU KIỆN CHUYỂN SANG GIAI ĐOẠN 1

# Điều kiện:

# malePlaced \== true

# và

# femalePlaced \== true

# Khi đó:

# BẮT ĐẦU QUAN SÁT được mở.

# Nếu một trong hai chưa đúng:

* # không thể bắt đầu;

* # bước tiếp theo không hiển thị.

# ---

# XI. GIAI ĐOẠN 1 – NHẬN BIẾT MÈO ĐỰC VÀ MÈO CÁI

# Tiêu đề:

# GIAI ĐOẠN 1: MÈO ĐỰC VÀ MÈO CÁI

# Khi học sinh nhấp:

# ▶ BẮT ĐẦU QUAN SÁT SỰ SINH SẢN VÀ VÒNG ĐỜI

# hai con mèo được hiển thị cạnh nhau.

## Thông tin mở đầu

# Hiển thị:

# “Trong sinh sản, mèo đực tạo ra tế bào sinh dục đực, còn mèo cái tạo ra tế bào sinh dục cái.”

# Nhiệm vụ:

# “Hãy xác định mèo đực và mèo cái.”

# ---

## 11.1. Nhấp đúng mèo đực

# Mèo đực:

* # sáng viền;

* # có hiệu ứng highlight;

* # hiển thị nhãn:

# MÈO ĐỰC

# Thông báo:

# “Mèo đực tạo ra tế bào sinh dục đực.”

# Đánh dấu:

# maleIdentified \= true

# ---

## 11.2. Nhấp đúng mèo cái

# Mèo cái sáng viền.

# Hiển thị:

# MÈO CÁI

# Thông báo:

# “Mèo cái tạo ra tế bào sinh dục cái.”

# Đánh dấu:

# femaleIdentified \= true

# ---

## 11.3. Nhấp sai

# Hiển thị:

# “Hãy quan sát và xác định đúng mèo đực hoặc mèo cái.”

# Không trừ điểm.

# Không reset.

# ---

## 11.4. Hoàn thành

# Khi:

# maleIdentified \== true

# và

# femaleIdentified \== true

# hiển thị:

# MÈO ĐỰC \+ MÈO CÁI ✓

# Thanh tiến trình sáng.

# Mở:

# TINH TRÙNG \+ TRỨNG

# ---

# XII. GIAI ĐOẠN 2 – TINH TRÙNG VÀ TRỨNG

# Tiêu đề:

# GIAI ĐOẠN 2: TINH TRÙNG VÀ TRỨNG

# Màn hình chuyển sang chế độ quan sát phóng đại.

# Chia thành hai khu vực.

# ---

## 12.1. Khu vực bên trái – Mèo đực

# Hiển thị:

* # hình ảnh/mô hình mèo đực;

* # vùng mô phỏng tinh trùng;

* # nhiều tinh trùng 3D.

# Khi nhấp vào tinh trùng:

# Hiển thị:

# TINH TRÙNG

# Tế bào sinh dục đực

# Thông báo:

# “Mèo đực tạo ra tinh trùng.”

# ---

# 12.2. Khu vực bên phải – Mèo cái

# Hiển thị:

* # hình ảnh/mô hình mèo cái;

* # trứng 3D phóng đại.

# Khi nhấp vào trứng:

# Hiển thị:

# TRỨNG

# Tế bào sinh dục cái

# Thông báo:

# “Mèo cái tạo ra trứng.”

# ---

# 12.3. Nhiệm vụ kéo – thả

# Hiển thị:

# “Hãy đưa tinh trùng vào khu vực MÈO ĐỰC và trứng vào khu vực MÈO CÁI.”

# ---

## 12.4. Kéo tinh trùng đúng

# Tinh trùng:

* # di chuyển theo con trỏ;

* # khi vào vùng đúng thì tự căn vị trí;

* # bám vào khu vực mèo đực.

# Thông báo:

# “Đúng\! Đây là tế bào sinh dục đực.”

# Đánh dấu:

# spermPlacedCorrectly \= true

# ---

## 12.5. Kéo tinh trùng sai

# Hiển thị:

# “Chưa đúng. Hãy đưa tinh trùng vào khu vực mèo đực.”

# Tinh trùng trở về vị trí ban đầu.

# ---

## 12.6. Kéo trứng đúng

# Trứng được đặt vào vùng mèo cái.

# Thông báo:

# “Đúng\! Đây là tế bào sinh dục cái.”

# Đánh dấu:

# eggPlacedCorrectly \= true

# ---

## 12.7. Kéo trứng sai

# Hiển thị:

# “Chưa đúng. Hãy đưa trứng vào khu vực mèo cái.”

# Trứng quay lại vị trí ban đầu.

# ---

## 12.8. Hoàn thành

# Điều kiện:

# spermPlacedCorrectly \== true

# và

# eggPlacedCorrectly \== true

# Thanh tiến trình:

# TINH TRÙNG \+ TRỨNG ✓

# Mở:

# THỤ TINH

# ---

# XIII. GIAI ĐOẠN 3 – THỤ TINH

# Tiêu đề:

# GIAI ĐOẠN 3: THỤ TINH

# Ở trung tâm:

* # một trứng lớn;

* # nhiều tinh trùng xung quanh.

# Thông báo:

# “Hãy chọn một tinh trùng và đưa tinh trùng đến gần trứng.”

# ---

## 13.1. Tương tác

# Học sinh:

1. # nhấp vào một tinh trùng;

2. # giữ chuột;

3. # kéo tinh trùng;

4. # đưa tinh trùng đến gần trứng;

5. # thả.

# ---

## 13.2. Khi đúng

# Trình tự hoạt ảnh:

1. # Tinh trùng được highlight.

2. # Tinh trùng di chuyển về phía trứng.

3. # Trứng phát sáng nhẹ.

4. # Tinh trùng tiến đến trứng.

5. # Hai tế bào kết hợp.

6. # Các tinh trùng còn lại mờ dần.

7. # Khu vực trung tâm chuyển sang trạng thái mô phỏng sau thụ tinh.

# Hiển thị lớn:

# THỤ TINH ĐÃ XẢY RA

# Thông báo:

# “Thụ tinh là sự kết hợp giữa tế bào sinh dục đực và tế bào sinh dục cái.”

# Đánh dấu:

# fertilizationComplete \= true

# ---

## 13.3. Nhấp vào trứng

# Hiển thị:

# “Hãy chọn một tinh trùng để thực hiện quá trình thụ tinh.”

# ---

## 13.4. Kéo tinh trùng sai

# Hiển thị:

# “Hãy đưa tinh trùng đến trứng.”

# Tinh trùng quay về vị trí gần nhất.

# ---

## 13.5. Hoàn thành

# Thanh:

# THỤ TINH ✓

# Mở:

# HỢP TỬ

# ---

# XIV. GIAI ĐOẠN 4 – HỢP TỬ HÌNH THÀNH

# Sau khi thụ tinh hoàn thành:

* # trứng thay đổi trạng thái;

* # tinh trùng được ẩn;

* # xuất hiện hợp tử;

* # hợp tử nằm ở trung tâm.

# Tiêu đề:

# GIAI ĐOẠN 4: HỢP TỬ

# Thông báo:

# “Sau khi thụ tinh, hợp tử được hình thành.”

# ---

## 14.1. Quan sát hợp tử

# Hướng dẫn:

# “Hãy dùng kính phóng đại để quan sát hợp tử.”

# Học sinh kéo kính đến hợp tử.

### Đúng

* # hợp tử được phóng đại;

* # viền sáng;

* # hiển thị thông tin.

# Thông báo:

# “Sau khi thụ tinh, hợp tử được hình thành.”

# Đánh dấu:

# zygoteObserved \= true

### Sai

# “Hãy đưa kính đến gần hợp tử để quan sát.”

# ---

## 14.2. Nhấp hợp tử

# Sau khi quan sát đúng, học sinh nhấp vào hợp tử.

# Hiển thị nút:

# ▶ THEO DÕI HỢP TỬ PHÁT TRIỂN

# ---

# XV. GIAI ĐOẠN 5 – HỢP TỬ PHÁT TRIỂN THÀNH PHÔI

# Tiêu đề:

# GIAI ĐOẠN 5: HỢP TỬ PHÁT TRIỂN THÀNH PHÔI

# Khi nhấp:

# ▶ THEO DÕI HỢP TỬ PHÁT TRIỂN

# xuất hiện timeline:

# Ngày 0 → Ngày 15 → Ngày 30 → Ngày 45

# ---

# 15.1. Ngày 0

# Mô hình:

* # hợp tử rất nhỏ;

* # nằm ở trung tâm;

* # chưa có hình dạng cơ thể rõ ràng.

# Thông tin:

# “Hợp tử mới được hình thành.”

# ---

# 15.2. Ngày 15

# Hoạt ảnh chuyển đổi:

* # hợp tử thay đổi;

* # bắt đầu phân chia;

* # xuất hiện nhiều tế bào.

# Thông tin:

# “Hợp tử bắt đầu phân chia thành nhiều tế bào.”

# ---

# 15.3. Ngày 30

# Mô hình tiếp tục phát triển.

# Thông tin:

# “Các tế bào tiếp tục phân chia và phát triển.”

# Cấu trúc phôi bắt đầu rõ hơn.

# ---

# 15.4. Ngày 45

# Hình dạng cơ thể rõ hơn.

# Thông tin:

# “Hợp tử tiếp tục phát triển thành phôi.”

# Đối tượng chính lúc này là:

# PHÔI

# ---

# 15.5. Kính phóng đại

# Hướng dẫn:

# “Hãy dùng kính phóng đại để quan sát phôi.”

# Khi kính đặt đúng:

* # phôi phóng đại;

* # cấu trúc rõ hơn;

* # viền sáng;

* # hiển thị thông tin quan sát.

# ---

# 15.6. Điều khiển timeline

# Học sinh được phép:

* # kéo thanh thời gian;

* # nhấp mốc thời gian đã mở.

# Không cho phép học sinh truy cập trực tiếp mốc chưa mở.

# Nếu kéo đến mốc chưa mở:

# “Hãy hoàn thành mốc trước để tiếp tục quan sát.”

# ---

# 15.7. Hoàn thành phôi

# Điều kiện:

* # đã xem các mốc cần thiết;

* # đã quan sát phôi bằng kính.

# Thanh:

# PHÔI ✓

# Mở:

# THAI

# ---

# XVI. GIAI ĐOẠN 6 – PHÔI PHÁT TRIỂN THÀNH THAI

# Tiêu đề:

# GIAI ĐOẠN 6: PHÔI PHÁT TRIỂN THÀNH THAI

# Timeline:

# Ngày 45 → Ngày 60 → Gần ngày sinh

# Phôi lớn dần.

# ---

## 16.1. Ngày 45

# Cơ thể còn nhỏ.

# Các cấu trúc bắt đầu rõ.

# ---

## 16.2. Ngày 60

# Các bộ phận cơ thể rõ hơn.

# Có thể nhận biết:

* # đầu;

* # thân;

* # chân;

* # tai;

* # đuôi.

# ---

## 16.3. Gần ngày sinh

# Thai lớn hơn.

# Hình dạng cơ thể rõ hơn.

# Thông báo:

# “Phôi tiếp tục phát triển, các bộ phận cơ thể dần hình thành và thai lớn lên trong cơ thể mèo mẹ.”

# ---

# 16.4. Tương tác khám phá

# Học sinh nhấp:

* # đầu;

* # chân;

* # thân;

* # đuôi.

# Mỗi bộ phận được highlight.

# Thông tin mẫu:

# “Các bộ phận cơ thể của thai ngày càng phát triển rõ hơn.”

# ---

# 16.5. Quan sát bằng kính

# Học sinh kéo kính đến thai.

# Khi đúng:

* # thai phóng đại;

* # vùng cơ thể rõ hơn;

* # hiển thị thông tin.

# ---

# 16.6. Hoàn thành

# Khi thai phát triển gần hoàn chỉnh:

# THAI ✓

# Mở:

# MÈO CON

# ---

# XVII. GIAI ĐOẠN 7 – MÈO CON ĐƯỢC SINH RA

# Tiêu đề:

# GIAI ĐOẠN 7: MÈO CON

# Camera chuyển cảnh.

## Trình tự camera

### Cảnh 1

# Camera đang ở góc nhìn mô phỏng bên trong cơ thể mèo mẹ.

### Cảnh 2

# Camera từ từ lùi ra.

### Cảnh 3

# Không gian bên ngoài xuất hiện.

### Cảnh 4

# Mèo mẹ xuất hiện.

### Cảnh 5

# Mèo con mới sinh xuất hiện cạnh mèo mẹ.

# Không sử dụng chuyển cảnh đột ngột.

# ---

# 17.1. Đặc điểm mèo con mới sinh

# Mô hình thể hiện:

* # kích thước nhỏ;

* # mắt chưa mở;

* # tai nhỏ;

* # chân còn yếu;

* # vận động hạn chế;

* # phụ thuộc vào mèo mẹ;

* # bú sữa mẹ.

# Thông tin:

# “Sau khi thai phát triển đầy đủ trong cơ thể mèo mẹ, mèo con được sinh ra.”

# ---

# XVIII. TƯƠNG TÁC QUAN SÁT MÈO CON

# Hướng dẫn:

# “Hãy nhấp vào mèo con để quan sát.”

## Khi nhấp đúng

# Mèo con được phóng đại.

# Hiển thị:

# MÈO CON MỚI SINH

# Hướng dẫn tiếp:

# “Hãy dùng kính phóng đại để quan sát mèo con.”

# ---

## 18.1. Quan sát các vùng

# Khi kính đến:

### Mắt

# Highlight vùng mắt.

### Tai

# Highlight tai.

### Chân

# Highlight chân.

### Thân

# Highlight thân.

# Thông tin:

# “Mèo con mới sinh có kích thước nhỏ và khả năng vận động còn yếu.”

# ---

## 18.2. Nhấp sai

# Nếu học sinh nhấp vào khu vực không phải mèo con:

# “Hãy nhấp vào mèo con để quan sát.”

# ---

## 18.3. Hoàn thành

# Sau khi quan sát đúng:

# MÈO CON ✓

# Mở:

# MÈO CON LỚN DẦN

# ---

# XIX. GIAI ĐOẠN 8 – MÈO CON LỚN DẦN

# Tiêu đề:

# GIAI ĐOẠN 8: MÈO CON LỚN DẦN

# Timeline:

# 1 tuần → 2 tuần → 1 tháng → 2 tháng

# Có thể sử dụng hiệu ứng tua nhanh giữa các giai đoạn.

# ---

# 19.1. MỐC 1 TUẦN

# Mô hình:

* # lớn hơn một chút;

* # cử động nhiều hơn;

* # vẫn phụ thuộc chủ yếu vào sữa mẹ.

# Thông báo:

# “Mèo con bắt đầu lớn lên và vận động nhiều hơn.”

# ---

# 19.2. MỐC 2 TUẦN

# Mô hình:

* # mắt bắt đầu mở;

* # tai rõ hơn;

* # bò nhiều hơn;

* # bắt đầu đi lại.

# Thông báo:

# “Mèo con bắt đầu mở mắt và tăng khả năng vận động.”

# ---

# 19.3. MỐC 1 THÁNG

# Mô hình:

* # cơ thể lớn rõ rệt;

* # đi lại tốt hơn;

* # chơi;

* # bắt đầu tập ăn thức ăn phù hợp.

# Thông báo:

# “Mèo con bắt đầu tập ăn và hoạt động độc lập hơn.”

# ---

# 19.4. MỐC 2 THÁNG

# Mô hình:

* # cơ thể lớn hơn;

* # chạy nhảy tốt hơn;

* # ăn thức ăn phù hợp;

* # ít phụ thuộc vào sữa mẹ hơn.

# Thông báo:

# “Mèo con ngày càng lớn và tự lập hơn.”

# ---

# XX. SO SÁNH CÁC GIAI ĐOẠN MÈO CON

# Sau khi hoàn thành mốc 2 tháng, hiển thị 3 mô hình:

# MÈO CON MỚI SINH

# MÈO CON 1 THÁNG

# MÈO CON 2 THÁNG

# Ba mô hình đặt cạnh nhau.

# ---

## 20.1. Tương tác

# Học sinh nhấp từng mô hình.

### Khi nhấp

* # mô hình được phóng to;

* # các đường viền kích thước xuất hiện;

* # thông tin hiển thị.

# Ví dụ:

# “Mèo con 2 tháng tuổi có kích thước lớn hơn và khả năng vận động tốt hơn mèo con mới sinh.”

# ---

# 20.2. Thông tin tổng hợp

# Hiển thị:

# “Qua từng giai đoạn, mèo con tăng kích thước và khả năng vận động ngày càng hoàn thiện.”

# ---

# 20.3. Hoàn thành

# Thanh:

# MÈO CON LỚN DẦN ✓

# Mở:

# MÈO TRƯỞNG THÀNH

# ---

# XXI. GIAI ĐOẠN 9 – MÈO TRƯỞNG THÀNH

# Tiêu đề:

# GIAI ĐOẠN 9: MÈO TRƯỞNG THÀNH

# Timeline:

# 2 tháng → 6 tháng → 1 năm

# ---

# 21.1. MỐC 2 THÁNG

# Đặc điểm:

* # cơ thể còn nhỏ;

* # hoạt động nhanh nhẹn;

* # có thể tự ăn thức ăn phù hợp.

# ---

# 21.2. MỐC 6 THÁNG

# Đặc điểm:

* # cơ thể lớn hơn;

* # chân phát triển;

* # thân phát triển;

* # lông phát triển đầy đủ;

* # vận động linh hoạt.

# ---

# 21.3. MỐC 1 NĂM

# Đặc điểm:

* # cơ thể đạt kích thước gần trưởng thành;

* # vận động hoàn thiện;

* # có thể tự kiếm ăn;

* # có khả năng sinh sản khi trưởng thành.

# ---

# 21.4. Thông tin tổng kết

# Hiển thị:

# “Mèo con tiếp tục lớn lên, cơ thể phát triển hoàn thiện và trở thành mèo trưởng thành.”

# Thanh tiến trình:

# MÈO TRƯỞNG THÀNH ✓

# ---

# XXII. HOẠT ĐỘNG TỔNG KẾT – SẮP XẾP VÒNG ĐỜI

# Sau khi hoàn thành toàn bộ các giai đoạn, hiển thị màn hình tổng kết.

# Tiêu đề:

# SẮP XẾP QUÁ TRÌNH SINH SẢN VÀ PHÁT TRIỂN CỦA MÈO

# Hướng dẫn:

# “Hãy kéo các thẻ và sắp xếp theo đúng trình tự sinh sản và phát triển của mèo.”

# ---

# 22.1. Các thẻ

# Hiển thị 8 thẻ:

1. # TINH TRÙNG \+ TRỨNG

2. # THỤ TINH

3. # HỢP TỬ

4. # PHÔI

5. # THAI

6. # MÈO CON

7. # MÈO CON LỚN DẦN

8. # MÈO TRƯỞNG THÀNH

# Các thẻ ban đầu được xáo trộn.

# ---

# 22.2. Khu vực thả

# Có 8 vị trí trống.

# Mỗi vị trí có:

* # số thứ tự;

* # vùng nhận thẻ;

* # hiệu ứng highlight khi thẻ được kéo đến gần.

# ---

# 22.3. Thứ tự đúng

# TINH TRÙNG \+ TRỨNG

# ↓

# THỤ TINH

# ↓

# HỢP TỬ

# ↓

# PHÔI

# ↓

# THAI

# ↓

# MÈO CON

# ↓

# MÈO CON LỚN DẦN

# ↓

# MÈO TRƯỞNG THÀNH

# ---

# 22.4. Nếu sắp xếp đúng

# Toàn bộ thẻ:

* # sáng lên;

* # xuất hiện dấu ✓;

* # các đường kết nối xuất hiện giữa các thẻ;

* # hiệu ứng chuyển động chạy theo hướng từ đầu đến cuối.

# Hiển thị:

# “Chính xác\! Em đã xác định đúng quá trình sinh sản và các giai đoạn phát triển của mèo.”

# Sau đó hiển thị:

# HOÀN THÀNH THÍ NGHIỆM

# ---

# 22.5. Nếu sắp xếp sai

# Hiển thị:

# “Chưa đúng. Hãy quan sát lại trình tự từ thụ tinh đến khi mèo trưởng thành.”

# Thẻ sai:

* # rung nhẹ;

* # trở về vị trí ban đầu.

# Không làm mất các thẻ đã đặt đúng trước đó, trừ thẻ đang được kiểm tra sai.

# ---

# XXIII. MÀN HÌNH HOÀN THÀNH

# Sau khi sắp xếp chính xác:

# Hiển thị:

# HOÀN THÀNH THÍ NGHIỆM\!

# Bên dưới:

# “Em đã tìm hiểu được quá trình sinh sản và vòng đời của mèo.”

# Hiển thị sơ đồ tổng quát:

# TINH TRÙNG \+ TRỨNG ↓ THỤ TINH ↓ HỢP TỬ ↓ PHÔI ↓ THAI ↓ MÈO CON ↓ MÈO CON LỚN DẦN ↓ MÈO TRƯỞNG THÀNH

# Có thể cho phép:

# XEM LẠI THÍ NGHIỆM

# Nút này chỉ dùng để xem lại, không reset tiến trình.

# ---

# XXIV. NỘI DUNG KẾT LUẬN

# Hiển thị ở màn hình cuối:

# “Mèo sinh sản bằng cách sinh con. Mèo đực tạo ra tinh trùng, mèo cái tạo ra trứng. Khi tinh trùng kết hợp với trứng sẽ xảy ra thụ tinh và hình thành hợp tử. Hợp tử phát triển thành phôi, phôi tiếp tục phát triển thành thai trong cơ thể mèo mẹ. Khi phát triển đầy đủ, mèo con được sinh ra. Sau khi sinh, mèo con lớn dần, kích thước cơ thể tăng lên, khả năng vận động và tự ăn ngày càng hoàn thiện, cuối cùng phát triển thành mèo trưởng thành.”

# ---

# XXV. LOGIC KHÓA/MỞ TOÀN BỘ HỆ THỐNG

## Trạng thái 0 – Ban đầu

* # Mèo đực ở khay.

* # Mèo cái ở khay.

* # Kính ở khay.

* # Bàn trống.

* # Ngày \= 0\.

* # Tất cả giai đoạn khóa.

* # Nút bắt đầu khóa.

# ---

## Trạng thái 1 – Đã đặt mèo đực

# Điều kiện:

# malePlaced \= true

# Mèo đực ở bàn.

# Mèo cái vẫn có thể được kéo vào.

# Nút bắt đầu vẫn khóa.

# ---

## Trạng thái 2 – Đã đặt cả hai

# Điều kiện:

# malePlaced \= true

# và

# femalePlaced \= true

# Mở:

# BẮT ĐẦU QUAN SÁT

# ---

## Trạng thái 3 – Đã xác định mèo đực/cái

# Điều kiện:

# maleIdentified \= true

# femaleIdentified \= true

# Mở:

# TINH TRÙNG \+ TRỨNG

# ---

## Trạng thái 4 – Đã xác định tinh trùng và trứng

# Điều kiện:

* # tinh trùng đúng;

* # trứng đúng;

* # hoàn thành kéo–thả.

# Mở:

# THỤ TINH

# ---

## Trạng thái 5 – Đã thụ tinh

# Điều kiện:

# fertilizationComplete \= true

# Xuất hiện:

# HỢP TỬ

# ---

## Trạng thái 6 – Đã quan sát hợp tử

# Điều kiện:

# zygoteObserved \= true

# Mở:

# THEO DÕI HỢP TỬ PHÁT TRIỂN

# ---

## Trạng thái 7 – Đã hoàn thành phôi

# Điều kiện:

* # hoàn thành các mốc phát triển;

* # quan sát phôi.

# Mở:

# THAI

# ---

## Trạng thái 8 – Đã hoàn thành thai

# Điều kiện:

* # thai phát triển gần hoàn chỉnh;

* # đã quan sát các bộ phận cần thiết.

# Xuất hiện:

# MÈO CON

# ---

## Trạng thái 9 – Đã quan sát mèo con

# Điều kiện:

* # nhấp đúng mèo con;

* # quan sát bằng kính.

# Mở:

# MÈO CON LỚN DẦN

# ---

## Trạng thái 10 – Hoàn thành quá trình lớn dần

# Điều kiện:

# Đã hoàn thành:

* # 1 tuần;

* # 2 tuần;

* # 1 tháng;

* # 2 tháng;

* # so sánh 3 mô hình.

# Mở:

# MÈO TRƯỞNG THÀNH

# ---

## Trạng thái 11 – Mèo trưởng thành

# Điều kiện:

# Đã hoàn thành:

* # 2 tháng;

* # 6 tháng;

* # 1 năm.

# Đánh dấu:

# MÈO TRƯỞNG THÀNH ✓

# Mở:

# SẮP XẾP VÒNG ĐỜI

# ---

## Trạng thái 12 – Hoàn thành

# Điều kiện:

# 8 thẻ được sắp xếp đúng.

# Hiển thị:

# HOÀN THÀNH THÍ NGHIỆM

# ---

# XXVI. QUY TẮC TƯƠNG TÁC KÉO – THẢ

## Khi bắt đầu kéo

# Vật thể:

* # nâng nhẹ;

* # có bóng;

* # đi theo con trỏ;

* # vùng nhận có thể sáng nhẹ.

## Khi đi gần vùng đúng

# Vùng thả:

* # sáng lên;

* # hiển thị trạng thái có thể thả.

## Khi thả đúng

# Vật thể:

* # tự căn vị trí;

* # dừng tại vùng đích;

* # phát sáng nhẹ;

* # hiện thông báo.

## Khi thả sai

# Vật thể:

* # phát hiệu ứng sai nhẹ;

* # quay về vị trí ban đầu;

* # hiển thị hướng dẫn;

* # không làm mất tiến trình.

# ---

# XXVII. QUY TẮC NHẤP

## Nhấp đúng

* # Highlight đối tượng.

* # Hiển thị thông tin.

* # Có thể mở tương tác tiếp theo.

## Nhấp sai

* # Không làm thay đổi tiến trình.

* # Hiển thị hướng dẫn.

* # Không khóa người học.

# Thông báo phải mang tính hướng dẫn, không mang tính phê bình.

# ---

# XXVIII. QUY TẮC KÍNH PHÓNG ĐẠI

# Kính có trạng thái:

### IDLE

# Ở khay dụng cụ.

### DRAGGING

# Đang được kéo.

### VALID\_TARGET

# Đang nằm trên đối tượng cần quan sát.

### INVALID\_TARGET

# Đang nằm sai vị trí.

### OBSERVING

# Đang quan sát.

### RETURN

# Tự động trở về vị trí.

# Kính có thể sử dụng nhiều lần trong cùng một thí nghiệm.

# ---

# XXIX. QUY TẮC TIMELINE

# Timeline phải thể hiện rõ:

* # mốc hiện tại;

* # mốc đã mở;

* # mốc chưa mở.

## Mốc đã mở

# Có thể:

* # nhấp;

* # kéo đến;

* # xem lại.

## Mốc chưa mở

# Không thể truy cập.

# Nếu học sinh cố truy cập:

# “Hãy hoàn thành mốc trước để tiếp tục quan sát.”

# Timeline không được phép làm thay đổi thứ tự logic của thí nghiệm.

# ---

# XXX. QUY TẮC HOẠT ẢNH

# Các hoạt ảnh cần:

* # mượt;

* # ngắn;

* # có mục đích;

* # phục vụ việc giải thích kiến thức.

# Không sử dụng hoạt ảnh quá nhanh khiến học sinh không quan sát được.

## Hoạt ảnh quan trọng

### Đặt mèo

# Mèo di chuyển từ khay → bàn.

### Xác định

# Đối tượng sáng viền.

### Tinh trùng

# Tinh trùng di chuyển nhẹ.

### Thụ tinh

# Tinh trùng → trứng → kết hợp.

### Hợp tử

# Hợp tử xuất hiện sau thụ tinh.

### Phân chia

# Một hợp tử → nhiều tế bào.

### Phôi

# Cấu trúc cơ thể dần rõ.

### Thai

# Thai lớn dần.

### Sinh

# Camera từ bên trong → bên ngoài.

### Mèo con lớn

# Các mô hình thay đổi theo timeline.

### Mèo trưởng thành

# Mèo phát triển qua các mốc tuổi.

### Tổng kết

# Các giai đoạn nối với nhau bằng đường chuyển động.

# ---

# XXXI. CAMERA

# Camera được sử dụng để tạo cảm giác đang thực hiện một thí nghiệm thực tế.

## Camera tổng quan

# Nhìn toàn bộ:

* # khay;

* # bàn;

* # mèo;

* # thanh tiến trình.

## Camera cận

# Dùng khi:

* # quan sát tinh trùng;

* # quan sát trứng;

* # quan sát hợp tử;

* # quan sát phôi;

* # quan sát thai;

* # quan sát mèo con.

## Camera chuyển cảnh sinh

# Khi thai → mèo con:

# Inside view → zoom out → exterior view

# Chuyển cảnh phải mềm và dễ hiểu.

# ---

# XXXII. HỆ THỐNG PHẢN HỒI

# Phản hồi được chia thành 3 loại.

## 1\. Phản hồi đúng

# Ví dụ:

# “Đúng\!”

# “Chính xác\!”

# “Đã quan sát đúng.”

# Có hiệu ứng:

* # highlight;

* # dấu ✓;

* # âm thanh xác nhận nhẹ nếu có.

## 2\. Phản hồi sai

# Ví dụ:

# “Chưa đúng. Hãy thử lại.”

# Hoặc hướng dẫn cụ thể:

# “Hãy đưa tinh trùng vào khu vực mèo đực.”

# Không trừ điểm.

## 3\. Phản hồi hoàn thành

# Ví dụ:

# “Em đã hoàn thành giai đoạn này.”

# Sau đó mở bước kế tiếp.

# ---

# XXXIII. DANH SÁCH BIẾN TRẠNG THÁI GỢI Ý CHO DEVELOPER

# Có thể tổ chức trạng thái theo dạng:

# malePlaced

# femalePlaced

# 

# maleIdentified

# femaleIdentified

# 

# spermObserved

# eggObserved

# 

# spermPlacedCorrectly

# eggPlacedCorrectly

# 

# fertilizationComplete

# 

# zygoteVisible

# zygoteObserved

# 

# embryoDay0Viewed

# embryoDay15Viewed

# embryoDay30Viewed

# embryoDay45Viewed

# embryoObserved

# 

# fetusDay45Viewed

# fetusDay60Viewed

# fetusNearBirthViewed

# fetusObserved

# 

# kittenVisible

# kittenObserved

# 

# kitten1WeekViewed

# kitten2WeeksViewed

# kitten1MonthViewed

# kitten2MonthsViewed

# 

# kittenComparisonComplete

# 

# adult2MonthsViewed

# adult6MonthsViewed

# adult1YearViewed

# 

# adultStageComplete

# 

# finalSortingComplete

# 

# experimentComplete

# 

# ---

# XXXIV. QUY TẮC RESET LOGIC

# Khi resetExperiment() được gọi:

# stopAllAnimations()

# 

# stopAllTimers()

# 

# resetTimeline()

# 

# resetMaleCat()

# 

# resetFemaleCat()

# 

# removeSperm()

# 

# removeEgg()

# 

# removeFertilizationState()

# 

# removeZygote()

# 

# removeEmbryo()

# 

# removeFetus()

# 

# removeKitten()

# 

# removeKittenGrowthStages()

# 

# removeAdultCat()

# 

# resetMagnifyingGlass()

# 

# clearObservationResults()

# 

# clearUnlockedStages()

# 

# clearProgress()

# 

# resetObservationTable()

# 

# resetAllStateVariables()

# 

# lockAllFutureStages()

# 

# showInitialState()

# 

# Sau khi hoàn thành reset:

# malePlaced \= false

# femalePlaced \= false

# 

# maleIdentified \= false

# femaleIdentified \= false

# 

# spermObserved \= false

# eggObserved \= false

# 

# spermPlacedCorrectly \= false

# eggPlacedCorrectly \= false

# 

# fertilizationComplete \= false

# 

# zygoteVisible \= false

# zygoteObserved \= false

# 

# embryoObserved \= false

# fetusObserved \= false

# kittenObserved \= false

# 

# kittenComparisonComplete \= false

# adultStageComplete \= false

# 

# finalSortingComplete \= false

# experimentComplete \= false

# 

# ---

# XXXV. LOGIC TỔNG THỂ

# START

# ↓

# Đặt mèo đực

# ↓

# Đặt mèo cái

# ↓

# Mở BẮT ĐẦU QUAN SÁT

# ↓

# Xác định mèo đực

# ↓

# Xác định mèo cái

# ↓

# MỞ TINH TRÙNG \+ TRỨNG

# ↓

# Quan sát tinh trùng

# ↓

# Quan sát trứng

# ↓

# Kéo tinh trùng vào khu vực mèo đực

# ↓

# Kéo trứng vào khu vực mèo cái

# ↓

# MỞ THỤ TINH

# ↓

# Chọn tinh trùng

# ↓

# Đưa tinh trùng đến trứng

# ↓

# THỤ TINH

# ↓

# HỢP TỬ

# ↓

# Quan sát hợp tử bằng kính

# ↓

# Theo dõi hợp tử phát triển

# ↓

# Ngày 0

# ↓

# Ngày 15

# ↓

# Ngày 30

# ↓

# Ngày 45

# ↓

# PHÔI

# ↓

# Ngày 45

# ↓

# Ngày 60

# ↓

# Gần ngày sinh

# ↓

# THAI

# ↓

# MÈO CON ĐƯỢC SINH RA

# ↓

# Quan sát mèo con

# ↓

# 1 tuần

# ↓

# 2 tuần

# ↓

# 1 tháng

# ↓

# 2 tháng

# ↓

# So sánh mèo con

# ↓

# 2 tháng

# ↓

# 6 tháng

# ↓

# 1 năm

# ↓

# MÈO TRƯỞNG THÀNH

# ↓

# SẮP XẾP VÒNG ĐỜI

# ↓

# KIỂM TRA

# ↓

# ĐÚNG

# ↓

# HOÀN THÀNH

# 

# ---

# XXXVI. CÁC TRƯỜNG HỢP SAI KHÔNG ĐƯỢC LÀM MẤT TIẾN TRÌNH

# Website phải đảm bảo:

### Sai vị trí kéo – thả

# → Vật thể quay lại.

### Nhấp sai

# → Hiển thị hướng dẫn.

### Chọn sai đối tượng

# → Không mất kết quả trước đó.

### Đặt kính sai

# → Kính quay lại.

### Kéo timeline sai

# → Không mở mốc mới.

### Sắp xếp thẻ sai

# → Chỉ thẻ sai quay lại.

# Không được reset toàn bộ thí nghiệm chỉ vì học sinh thao tác sai.

# ---

# XXXVII. CHẾ ĐỘ XEM LẠI SAU KHI HOÀN THÀNH

# Sau khi hoàn thành toàn bộ thí nghiệm, học sinh được phép xem lại.

# Có thể nhấp vào:

* # Mèo đực \+ mèo cái;

* # Tinh trùng \+ trứng;

* # Thụ tinh;

* # Hợp tử;

* # Phôi;

* # Thai;

* # Mèo con;

* # Mèo con lớn dần;

* # Mèo trưởng thành.

# Khi xem lại:

* # không thay đổi trạng thái;

* # không khóa lại bước đã hoàn thành;

* # không xóa kết quả;

* # không tạo lại nhiệm vụ bắt buộc.

# Nút:

# XEM LẠI GIAI ĐOẠN

# chỉ phục vụ ôn tập.

# ---

# XXXVIII. BẢNG KIỂM TRA HOÀN THÀNH

| Giai đoạn | Điều kiện hoàn thành |
| ----- | ----- |
| Đặt mèo đực | Đặt đúng lên bàn |
| Đặt mèo cái | Đặt đúng cạnh mèo đực |
| Nhận biết | Xác định đúng cả hai |
| Tinh trùng \+ trứng | Xác định và kéo đúng |
| Thụ tinh | Đưa tinh trùng đến trứng |
| Hợp tử | Quan sát đúng bằng kính |
| Phôi | Hoàn thành timeline và quan sát |
| Thai | Quan sát sự phát triển và bộ phận |
| Mèo con | Nhấp và quan sát đúng |
| Mèo con lớn dần | Hoàn thành 4 mốc \+ so sánh |
| Mèo trưởng thành | Hoàn thành 3 mốc |
| Tổng kết | Sắp xếp đúng 8 thẻ |
| Hoàn thành | Tất cả điều kiện đều đúng |

# ---

# XXXIX. CẤU TRÚC NỘI DUNG TRÊN MỖI MÀN HÌNH

# Mỗi giai đoạn nên thống nhất cấu trúc:

### 1\. Tiêu đề

# Ví dụ:

# GIAI ĐOẠN 5: HỢP TỬ PHÁT TRIỂN THÀNH PHÔI

### 2\. Hướng dẫn

# Nói rõ học sinh cần làm gì.

### 3\. Khu vực mô phỏng

# Hiển thị vật thể chính.

### 4\. Khu vực tương tác

# Cho phép:

* # nhấp;

* # kéo;

* # thả;

* # sử dụng kính;

* # điều khiển timeline.

### 5\. Thông tin kiến thức

# Xuất hiện sau khi học sinh tương tác.

### 6\. Phản hồi

# Hiển thị đúng/sai.

### 7\. Nút tiếp tục

# Chỉ xuất hiện khi điều kiện giai đoạn hoàn thành.

### 8\. Thanh tiến trình

# Luôn cho học sinh biết:

* # đang ở đâu;

* # đã hoàn thành gì;

* # còn bước nào.

# ---

# XL. YÊU CẦU UX CHO HỌC SINH

# Website phải đảm bảo:

* # Học sinh luôn biết mình cần làm gì.

* # Không có bước bị mở quá sớm.

* # Không thể bỏ qua kiến thức quan trọng.

* # Sai có thể thử lại.

* # Không bị mất tiến trình do thao tác sai.

* # Đối tượng tương tác phải dễ nhận biết.

* # Vùng kéo – thả phải đủ lớn.

* # Nút phải đủ lớn để sử dụng trên màn hình cảm ứng.

* # Thông báo ngắn, rõ, dễ đọc.

* # Nội dung kiến thức xuất hiện ngay sau thao tác.

* # Các hoạt ảnh không được che mất đối tượng.

* # Không sử dụng quá nhiều hiệu ứng cùng lúc.

* # Màu sắc trạng thái phải nhất quán.

# ---

# XLI. QUY ƯỚC TRẠNG THÁI MÀU VÀ HIỆU ỨNG

# Có thể quy định thống nhất:

### Đối tượng đang được chọn

# → viền sáng.

### Đối tượng đúng

# → highlight \+ ✓.

### Đối tượng sai

# → rung nhẹ \+ thông báo.

### Giai đoạn đang thực hiện

# → sáng nổi bật trên thanh tiến trình.

### Giai đoạn đã hoàn thành

# → ✓.

### Giai đoạn khóa

# → giảm độ nổi bật \+ biểu tượng khóa.

### Nút có thể thao tác

# → sáng và có trạng thái hover/press.

### Nút khóa

# → mờ và không phản hồi thao tác.

# ---

# XLII. CHECKLIST CUỐI CÙNG CHO DEVELOPER

## Khởi động

* # Hiển thị khay dụng cụ.

* # Hiển thị mèo đực.

* # Hiển thị mèo cái.

* # Hiển thị kính.

* # Hiển thị bàn.

* # Hiển thị thanh tiến trình.

* # Nút bắt đầu đang khóa.

* # Nút làm lại luôn hoạt động.

## Chuẩn bị

* # Kéo mèo đực đúng.

* # Kéo mèo cái đúng.

* # Sai thì trả về.

* # Đủ hai mèo thì mở nút bắt đầu.

## Giai đoạn 1

* # Xác định mèo đực.

* # Xác định mèo cái.

* # Sai có hướng dẫn.

* # Đúng cả hai thì mở tinh trùng \+ trứng.

## Giai đoạn 2

* # Hiển thị tinh trùng.

* # Hiển thị trứng.

* # Quan sát đúng.

* # Kéo tinh trùng đúng.

* # Kéo trứng đúng.

* # Sai thì quay lại.

* # Hoàn thành thì mở thụ tinh.

## Giai đoạn 3

* # Có nhiều tinh trùng.

* # Có một trứng.

* # Chọn tinh trùng.

* # Kéo đến trứng.

* # Phát hoạt ảnh thụ tinh.

* # Tạo hợp tử.

## Giai đoạn 4

* # Hợp tử xuất hiện.

* # Kính quan sát đúng.

* # Hiển thị thông tin.

* # Mở theo dõi phát triển.

## Giai đoạn 5

* # Ngày 0\.

* # Ngày 15\.

* # Ngày 30\.

* # Ngày 45\.

* # Mô phỏng phân chia tế bào.

* # Phôi rõ dần.

* # Quan sát phôi.

* # Mở thai.

## Giai đoạn 6

* # Ngày 45\.

* # Ngày 60\.

* # Gần ngày sinh.

* # Thai lớn dần.

* # Hiển thị đầu.

* # Hiển thị thân.

* # Hiển thị chân.

* # Hiển thị tai.

* # Hiển thị đuôi.

* # Mở mèo con.

## Giai đoạn 7

* # Camera bên trong.

* # Camera zoom out.

* # Mèo mẹ xuất hiện.

* # Mèo con xuất hiện.

* # Quan sát mèo con.

* # Kính phóng đại.

* # Mắt/tai/chân/thân highlight.

* # Mở mèo con lớn dần.

## Giai đoạn 8

* # 1 tuần.

* # 2 tuần.

* # 1 tháng.

* # 2 tháng.

* # So sánh 3 mô hình.

* # Mở mèo trưởng thành.

## Giai đoạn 9

* # 2 tháng.

* # 6 tháng.

* # 1 năm.

* # Mèo trưởng thành xuất hiện.

* # Hoàn thành tiến trình.

## Tổng kết

* # 8 thẻ xuất hiện.

* # Thẻ có thể kéo.

* # Có 8 vị trí đích.

* # Kiểm tra thứ tự.

* # Sai thì trả thẻ.

* # Đúng thì ✓.

* # Hiệu ứng kết nối.

* # Hiển thị HOÀN THÀNH.

## Reset

* # Có hộp thoại xác nhận.

* # HỦY giữ nguyên.

* # LÀM LẠI reset toàn bộ.

* # Dừng animation.

* # Reset timeline.

* # Reset sinh vật.

* # Reset kính.

* # Reset bàn.

* # Reset progress.

* # Khóa lại toàn bộ bước.

# ---

# XLIII. FLOW HOÀN CHỈNH CỦA WEBSITE

# MÀN HÌNH BAN ĐẦU

# │

# ├── Khay dụng cụ

# │   ├── Mèo đực

# │   ├── Mèo cái

# │   └── Kính phóng đại

# │

# ├── Bàn quan sát trống

# │

# └── BẮT ĐẦU QUAN SÁT \[KHÓA\]

#         │

#         ▼

# ĐẶT MÈO ĐỰC

#         │

#         ▼

# ĐẶT MÈO CÁI

#         │

#         ▼

# BẮT ĐẦU QUAN SÁT

#         │

#         ▼

# GIAI ĐOẠN 1

# MÈO ĐỰC \+ MÈO CÁI

#         │

#         ▼

# GIAI ĐOẠN 2

# TINH TRÙNG \+ TRỨNG

#         │

#         ▼

# KÉO TINH TRÙNG \+ TRỨNG

#         │

#         ▼

# GIAI ĐOẠN 3

# THỤ TINH

#         │

#         ▼

# GIAI ĐOẠN 4

# HỢP TỬ

#         │

#         ▼

# GIAI ĐOẠN 5

# HỢP TỬ → PHÔI

#         │

#         ├── Ngày 0

#         ├── Ngày 15

#         ├── Ngày 30

#         └── Ngày 45

#         │

#         ▼

# GIAI ĐOẠN 6

# PHÔI → THAI

#         │

#         ├── Ngày 45

#         ├── Ngày 60

#         └── Gần ngày sinh

#         │

#         ▼

# GIAI ĐOẠN 7

# MÈO CON

#         │

#         ▼

# QUAN SÁT MÈO CON

#         │

#         ▼

# GIAI ĐOẠN 8

# MÈO CON LỚN DẦN

#         │

#         ├── 1 tuần

#         ├── 2 tuần

#         ├── 1 tháng

#         └── 2 tháng

#         │

#         ▼

# SO SÁNH MÈO CON

#         │

#         ▼

# GIAI ĐOẠN 9

# MÈO TRƯỞNG THÀNH

#         │

#         ├── 2 tháng

#         ├── 6 tháng

#         └── 1 năm

#         │

#         ▼

# TỔNG KẾT

#         │

#         ▼

# SẮP XẾP 8 GIAI ĐOẠN

#         │

#         ▼

# KIỂM TRA

#    ┌────┴────┐

#    │         │

#  SAI       ĐÚNG

#    │         │

#    ▼         ▼

# Thử lại   ✓ HOÀN THÀNH

#              │

#              ▼

#         KẾT LUẬN

# 

# ---

# XLIV. KẾT QUẢ HỌC TẬP CUỐI CÙNG

# Sau khi hoàn thành, học sinh cần có thể nhận biết và trình bày được chuỗi:

# TINH TRÙNG \+ TRỨNG

# → THỤ TINH

# → HỢP TỬ

# → PHÔI

# → THAI

# → MÈO CON

# → MÈO CON LỚN DẦN

# → MÈO TRƯỞNG THÀNH

# Đây là chuỗi kiến thức trung tâm của toàn bộ website.

# Mọi tương tác, hoạt ảnh, timeline và cơ chế khóa/mở đều phải phục vụ chuỗi này.

# ---

# XLV. NGUYÊN TẮC QUAN TRỌNG NHẤT KHI TRIỂN KHAI

1. # Không cho học sinh bỏ qua các bước kiến thức chính.

2. # Mỗi bước chỉ mở khi bước trước đã hoàn thành.

3. # Thao tác sai không làm mất tiến trình.

4. # Kéo – thả sai phải tự động trả vật thể về vị trí ban đầu.

5. # Kính phóng đại chỉ dùng để quan sát.

6. # Timeline chỉ mở đến các mốc đã được phép xem.

7. # Mọi thông tin kiến thức xuất hiện đúng thời điểm tương tác.

8. # Các mô hình 3D phải thay đổi rõ ràng giữa các giai đoạn.

9. # Hoạt ảnh phải giúp học sinh hiểu quá trình, không chỉ để trang trí.

10. # Thanh tiến trình phải luôn phản ánh chính xác trạng thái hiện tại.

11. # Sau khi hoàn thành, học sinh được xem lại mà không làm thay đổi tiến trình.

12. # Nút LÀM LẠI THÍ NGHIỆM luôn có thể sử dụng.

13. # LÀM LẠI phải đưa toàn bộ hệ thống về đúng trạng thái ban đầu.

14. # Màn hình cuối phải giúp học sinh nhìn thấy toàn bộ vòng đời theo một chuỗi liên tục.

15. # Kết thúc phải có phần kết luận để củng cố kiến thức.

# ---

# XLVI. CÂU KẾT LUẬN HIỂN THỊ CUỐI THÍ NGHIỆM

> # Mèo sinh sản bằng cách sinh con. Mèo đực tạo ra tinh trùng, mèo cái tạo ra trứng. Khi tinh trùng kết hợp với trứng sẽ xảy ra thụ tinh và hình thành hợp tử. Hợp tử phát triển thành phôi, phôi tiếp tục phát triển thành thai trong cơ thể mèo mẹ. Khi phát triển đầy đủ, mèo con được sinh ra. Sau khi sinh, mèo con lớn dần, kích thước cơ thể tăng lên, khả năng vận động và tự ăn ngày càng hoàn thiện, cuối cùng phát triển thành mèo trưởng thành.

# KẾT THÚC THÍ NGHIỆM

# HOÀN THÀNH ✓

# Em đã tìm hiểu được sự sinh sản và vòng đời của mèo.

# 

