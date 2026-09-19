/* Experiment 1 – all Vietnamese wording.
   • `md`  = copied word for word from "THÍ NGHIỆM 1909.md" (a test checks this, so typos cannot slip in).
   • `app` = short helper messages the md does not specify (marked so you can find and edit them).
   You can edit any text here without touching the program logic. */
(function (Lab) {
  'use strict';
  Lab.content.exp1 = {
    md: {
      title: 'THÍ NGHIỆM 1: TÌM HIỂU CÁC YẾU TỐ CẦN THIẾT CHO SỰ SỐNG VÀ PHÁT TRIỂN CỦA THỰC VẬT',
      steps: ['Đặt cây', 'Thiết lập điều kiện', 'Bắt đầu thí nghiệm', 'Quan sát kết quả'],
      tray: {
        potA: 'Chậu cây A', potB: 'Chậu cây B', water: 'Bình tưới nước', gravel: 'Chậu đất sỏi rửa sạch', npk: 'Phân NPK',
        blackBin: 'Thùng nhựa đen che sáng', clearBin: 'Thùng trong suốt có viền được dán kín'
      },
      msg: {
        placePotsFirst: 'Hãy đặt chậu cây lên bàn trước.',
        water: 'Hãy đưa bình tưới đến chậu cây.',
        gravel: 'Hãy đặt chậu đất sỏi vào vị trí của chậu B.',
        blackBin: 'Hãy úp thùng đen kín chậu cây.',
        clearBin: 'Hãy úp thùng trong suốt kín chậu cây.'
      },
      startButton: 'BẮT ĐẦU THÍ NGHIỆM',
      thermoTitle: 'BẢNG ĐIỀU KHIỂN NHIỆT ĐỘ',
      days: ['Ngày 1', 'Ngày 3', 'Ngày 7', 'Ngày 14'],
      after: '14 NGÀY SAU',
      placard: { A: 'CHẬU A – ĐỐI CHỨNG', B: 'CHẬU B – THÍ NGHIỆM' },
      rowA: ['Nước', 'Chất khoáng', 'Không khí', 'Ánh sáng', 'Nhiệt độ thích hợp'],
      rowB: { water: 'Nước', minerals: 'Chất khoáng', air: 'Không khí', light: 'Ánh sáng', temperature: 'Nhiệt độ' },
      status: {
        water: ['Có nước', 'Thiếu nước'], minerals: ['Có chất khoáng', 'Thiếu chất khoáng'],
        air: ['Có không khí', 'Thiếu không khí'], light: ['Có ánh sáng', 'Thiếu ánh sáng']
      },
      info: {
        head: ['Thông tin', 'Chậu A', 'Chậu B'],
        rows: [
          ['Độ tuổi', '15 ngày tuổi', '15 ngày tuổi'],
          ['Chiều cao', '10 cm', '10 cm'],
          ['Số lượng lá', '5 lá xanh', '5 lá xanh'],
          ['Giống', 'Cây đậu xanh', 'Cây đậu xanh'],
          ['Tình trạng cây', 'Tươi tốt, khỏe mạnh, phát triển đồng đều', 'Tươi tốt, khỏe mạnh, phát triển đồng đều']
        ]
      },
      compare: {
        head: ['Yếu tố', 'Chậu A', 'Chậu B'],
        rows: { water: 'Nước', minerals: 'Chất khoáng', air: 'Không khí', light: 'Ánh sáng', temperature: 'Nhiệt độ', result: 'Kết quả' },
        yes: 'Có', lack: 'Thiếu', tempA: 'Thích hợp', healthy: 'Phát triển khỏe mạnh'
      },
      areas: { soil: 'Đất', stem: 'Thân', leaf: 'Lá', root: 'Rễ', env: 'Môi trường', bin: 'Thùng' },
      /* what the student sees on the plant after 14 days (md sections 22–26) */
      healthy: {
        title: 'CHẬU A – ĐỦ 5 YẾU TỐ',
        stemLeaf: ['Thân cây vươn cao.', 'Chiều cao tăng từ 10 cm lên 25 cm.', 'Lá vẫn xanh mượt.', 'Lá mở rộng.', 'Cây phát triển khỏe mạnh.', 'Tổng thể cây tươi tốt.'],
        roots: ['Rễ đâm sâu.', 'Rễ tỏa rộng.', 'Rễ phát triển mạnh.', 'Rễ bám chắc vào đất.']
      },
      obs: {
        minerals: {
          title: 'Thiếu chất khoáng',
          soil: ['Chủ yếu là sỏi.', 'Khô cằn.', 'Không có màu đất giàu dinh dưỡng.'],
          stem: ['Mảnh dẻ.', 'Còi cọc.', 'Phát triển kém.'],
          leaf: ['Nhỏ.', 'Vàng nhạt.'],
          root: ['Ngắn.', 'Thưa thớt.', 'Phát triển yếu.'],
          result: 'Cây sống còi cọc, suy yếu.'
        },
        water: {
          title: 'Thiếu nước',
          soil: ['Khô.', 'Nứt nẻ.'],
          leaf: ['Héo rũ.', 'Ngả vàng.'],
          stem: ['Gục xuống.'],
          root: ['Teo tóp.', 'Ngắn.', 'Không thể hút nước hiệu quả.'],
          result: 'Cây héo khô và chết.'
        },
        light: {
          title: 'Thiếu ánh sáng',
          env: ['Bên trong thùng rất tối.'],
          stem: ['Dài bất thường.', 'Cây cao nhưng yếu.'],
          leaf: ['Vàng nhạt hoặc trắng bệch.'],
          root: ['Phát triển yếu.', 'Bám đất kém.'],
          result: 'Cây yếu ớt, héo dần.'
        },
        air: {
          title: 'Thiếu không khí',
          bin: ['Thành thùng có hơi nước ngưng tụ.'],
          leaf: ['Lá rụng dần.'],
          stem: ['Thân có biểu hiện thối đen.'],
          soil: ['Ẩm/ướt.'],
          root: ['Thối đen.', 'Phát triển kém.'],
          result: 'Cây bị thối và chết.'
        }
      },
      /* md section 27 – the temperature table, word for word */
      temp: {
        cold: { range: '0–27°C', result: 'Không sống được sau 14 ngày', look: 'Cây ngừng phát triển, thân rũ xuống; lá bị tổn thương do nhiệt độ quá thấp; đất có thể đóng băng và rễ bị ảnh hưởng' },
        cool: { range: '28–31°C', result: 'Sống nhưng hoạt động không bình thường', look: 'Cây có biểu hiện sinh trưởng không tối ưu' },
        ideal: { range: '32–35°C', result: 'Sống khỏe', look: 'Cây sinh trưởng và phát triển bình thường' },
        warm: { range: '36–39°C', result: 'Sống nhưng hoạt động không bình thường', look: 'Cây chịu tác động của nhiệt độ cao, sinh trưởng giảm' },
        hot: { range: '40–60°C', result: 'Không sống được sau 7 ngày', look: 'Cây suy yếu nhanh và chết' }
      }
    },

    app: {
      help: [
        'Kéo chậu cây A và chậu cây B từ khay bên trái, thả lên bàn thí nghiệm.',
        'Chậu A là chậu đối chứng, chỉ để em quan sát. Em thay đổi điều kiện cho chậu B.',
        'Kéo bình tưới, đất sỏi, phân NPK, thùng đen hoặc thùng trong suốt thả vào chậu B. Em có thể làm theo bất kỳ thứ tự nào.',
        'Dùng nút − và + để chỉnh nhiệt độ của chậu B.',
        'Bấm BẮT ĐẦU THÍ NGHIỆM rồi quan sát cây sau 14 ngày và so sánh hai chậu.',
        'Bấm LÀM LẠI THÍ NGHIỆM bất cứ lúc nào để chơi lại từ đầu.'
      ],
      toolOnControl: 'Chậu A là chậu đối chứng, em hãy thử với chậu B nhé.',
      potOffTable: 'Hãy đặt chậu cây lên bàn thí nghiệm.',
      npk: 'Hãy đổ phân NPK vào chậu B.',
      alreadyRich: 'Đất đã có chất khoáng rồi.',
      placedA: 'Đã đặt chậu A – chậu đối chứng.',
      placedBoth: 'Đã đặt hai chậu. Em hãy thay đổi điều kiện của chậu B rồi bấm BẮT ĐẦU THÍ NGHIỆM nhé!',
      compareTitle: 'So sánh hai chậu',
      observeTitle: 'Quan sát chậu B',
      resultLabel: 'Kết quả',
      comboDead: 'Sau 14 ngày, cây suy yếu nghiêm trọng và không sống được do môi trường thiếu nhiều yếu tố cần thiết.',
      comboWeak: 'Sau 14 ngày, cây suy yếu nghiêm trọng do môi trường thiếu nhiều yếu tố cần thiết.',
      conclusion: 'Cây cần nước, chất khoáng, không khí, ánh sáng và nhiệt độ thích hợp để sống và phát triển.',
      heightNow: 'Chiều cao',
      tapPot: 'Nhấp vào chậu để xem thông tin',
      unlockHint: 'Đặt hai chậu lên bàn để mở bước tiếp theo'
    }
  };
})(window.Lab);
