# Quy tắc làm việc với trợ lý lập trình AI

## Mục tiêu

Giữ thay đổi nhỏ, đúng phạm vi và an toàn cho dự án.

## Quy trình bắt buộc

- Luôn theo thứ tự: hiểu bối cảnh -> lập kế hoạch -> xin hoặc đợi xác nhận nếu tác vụ có rủi ro cao -> mới sửa mã.
- Chỉ sửa trong phạm vi tệp cần thiết hoặc các tệp phát sinh lỗi liên đới.
- Không tự ý đổi hợp đồng API, lược đồ dữ liệu, thư viện phụ thuộc, cấu hình môi trường, luồng xác thực, nghiệp vụ thanh toán, di trú dữ liệu hoặc CI/CD khi chưa được cho phép rõ ràng.
- Mọi mã sinh ra chỉ là bản nháp cho tới khi có kiểm thử, kiểm tra chuẩn mã, kiểm tra kiểu dữ liệu và rà soát thủ công.
- Luôn ưu tiên bản vá nhỏ nhất giải quyết đúng vấn đề.
- Không tái cấu trúc ngoài phạm vi yêu cầu.
- Sau mỗi thay đổi phải báo cáo: đã sửa gì, vì sao, test nào đã chạy, rủi ro nào còn lại.
- Nếu thiếu thông tin, phải nêu giả định, không tự bịa.
- Nếu có nhiều phương án, phải nêu rõ phần đánh đổi trước khi triển khai.

## Quy ước ngôn ngữ và comment mã

- Không dùng tiếng Anh trong `README.md`.
- Không dùng tiếng Anh trong comment mã.
- Comment mã phải bằng tiếng Việt, ngắn gọn, trực quan.
- Ở phần thay thế/chỉnh sửa, comment phải nêu rõ chỗ nào thay thế cái gì nếu có.

## Quy ước commit GitHub

Áp dụng cho cả AI agent và lập trình viên trong dự án.

- Mọi commit bắt buộc theo đúng mẫu: `type(scope):description`.
- `type` phải thuộc danh sách cho phép bên dưới và dùng chữ thường.
- `scope` là phạm vi thay đổi chính, không được để trống.
- `description` bắt buộc viết bằng tiếng Việt có dấu, ngắn gọn, nêu đúng thay đổi chính.
- Không dùng thông điệp commit mơ hồ hoặc sai mẫu, ví dụ: `update`, `fix bug`, `abc`.
- Mỗi commit chỉ nên chứa một mục tiêu thay đổi chính để dễ truy vết.

## Các type hay dùng

- `feat`: Một tính năng mới.
- `fix`: Sửa lỗi.
- `docs`: Cập nhật tài liệu.
- `style`: Cải thiện định dạng, kiểu dáng, chuẩn mã nguồn.
- `refactor`: Sửa đổi mã nguồn không ảnh hưởng tính năng.
- `perf`: Cải thiện hiệu năng.
- `chore`: Cập nhật công cụ, thư viện hỗ trợ.
- `test`: Thêm hoặc cập nhật kiểm thử.
- `revert`: Quay lại một số thay đổi trước đó.

## Hướng dẫn viết thông điệp commit

- Chỉ dùng một `type` trong danh sách cho phép.
- Luôn có `scope` rõ ràng theo phạm vi thay đổi chính, ví dụ: `api`, `ui`, `dat-ve`, `thanh-toan`.
- Phần `description` phải là tiếng Việt có dấu, đi thẳng vào thay đổi chính, không mơ hồ.
- Không chèn nhiều thay đổi không liên quan trong một commit.

Ví dụ đúng:

```text
feat(dat-ve):thêm bộ lọc chuyến bay theo hạng ghế
fix(thanh-toan):sửa lỗi nhân đôi giao dịch khi tải lại trang
docs(api):bổ sung hướng dẫn xác thực bằng jwt
refactor(booking-service):tách hàm tính giá vé theo từng bước
test(dat-ve):thêm kiểm thử đơn vị cho hàm tính tổng tiền
```

## Quy định trước khi đẩy mã

- AI agent và lập trình viên phải tự kiểm tra thông điệp commit đúng mẫu trước khi `git commit`.
- Nếu sai mẫu hoặc phần `description` không phải tiếng Việt có dấu, phải sửa lại trước khi đẩy lên GitHub.

## Quy tắc teamwork GitHub cho nhóm 4

Áp dụng cho toàn bộ thành viên trong nhóm.

## Mô hình nhánh

- `main`: Nhánh ổn định, cấm đẩy trực tiếp.
- `deploy`: Nhánh triển khai dành riêng cho Vercel, được đồng bộ tự động từ `main`, không dùng để phát triển tính năng và không được xóa.
- `feat/<pham-vi>-<mo-ta-ngan>`: Nhánh làm tính năng mới.
- `fix/<pham-vi>-<mo-ta-ngan>`: Nhánh sửa lỗi.
- `docs/<pham-vi>-<mo-ta-ngan>`, `test/<pham-vi>-<mo-ta-ngan>`, `refactor/<pham-vi>-<mo-ta-ngan>`, `chore/<pham-vi>-<mo-ta-ngan>`: Nhánh cho thay đổi kỹ thuật tương ứng.
- `hotfix/<pham-vi>-<mo-ta-ngan>`: Nhánh xử lý lỗi khẩn cấp phát sinh trên `main`.

## Quy trình làm việc theo nhánh

- Luôn tạo nhánh mới từ `main`.
- Mỗi nhánh chỉ xử lý một mục tiêu chính.
- Mọi commit trong nhánh phải theo mẫu `type(scope):description` và phần `description` bằng tiếng Việt có dấu.
- Đẩy nhánh lên sớm và mở yêu cầu hợp nhất khi có bản chạy được.
- Trước khi xin duyệt, phải cập nhật thay đổi mới nhất từ `main` và xử lý xung đột.
- Không cập nhật thủ công vào `deploy` nếu không có yêu cầu bảo trì rõ ràng; nhánh này chỉ nhận đồng bộ tự động từ `main`.

## Quy tắc duyệt và hợp nhất mã

- Không hợp nhất trực tiếp vào `main`; chỉ hợp nhất qua yêu cầu hợp nhất.
- Bắt buộc có ít nhất 1 người duyệt; phần nhạy cảm như xác thực, thanh toán, di trú dữ liệu cần 2 người duyệt.
- Bắt buộc qua toàn bộ kiểm tra tự động: biên dịch, kiểm thử, kiểm tra chuẩn mã.
- Bắt buộc xử lý hết toàn bộ trao đổi trước khi hợp nhất.
- Ưu tiên kiểu hợp nhất `squash and merge` để lịch sử thay đổi gọn và rõ.
- Tiêu đề yêu cầu hợp nhất hoặc thông điệp hợp nhất phải theo mẫu `type(scope):description`, phần `description` bằng tiếng Việt có dấu.
- Sau khi hợp nhất phải xóa nhánh để tránh tồn đọng nhánh cũ.
- Riêng bạn, người có quyền hạn cao nhất, có quyền quyết định cuối cùng và được phép tự duyệt, tự hợp nhất khi cần.
- Riêng nhánh `deploy` là ngoại lệ, không được xóa sau khi hợp nhất vì đây là nhánh triển khai cố định cho Vercel.

## Thiết lập bảo vệ nhánh main trên GitHub

- Bật yêu cầu mở yêu cầu hợp nhất trước khi hợp nhất.
- Bật yêu cầu số lượt duyệt tối thiểu.
- Bật yêu cầu các kiểm tra tự động phải thành công trước khi hợp nhất.
- Bật yêu cầu xử lý xong mọi trao đổi trước khi hợp nhất.
- Tắt quyền đẩy thẳng và tắt force push vào `main`, trừ tài khoản của bạn trong trường hợp cần xử lý khẩn.
- Bật hủy duyệt cũ khi có commit mới được đẩy lên.
