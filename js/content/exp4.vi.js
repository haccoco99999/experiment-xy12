/* Experiment 4 – all Vietnamese wording.
   • `md`  = copied word for word from "THÍ NGHIỆM 1909.md" (a test checks this, so typos cannot slip in).
   • `app` = short helper messages the md does not specify (marked so you can find and edit them).
   You can edit any text here without touching the program logic. */
(function (Lab) {
  'use strict';
  Lab.content.exp4 = {
    md: {
      title: 'TÌM HIỂU SỰ TRAO ĐỔI NƯỚC, KHÔNG KHÍ VÀ THỨC ĂN CỦA ĐỘNG VẬT VỚI MÔI TRƯỜNG',
      steps: ['CHUỘT', 'LẤY VÀO', 'SỬ DỤNG', 'THẢI RA'],
      tray: { mouse: 'Chuột bạch', food: 'Khay thức ăn', water: 'Bát nước', magnifier: 'Kính phóng đại' },
      topics: { air: 'TRAO ĐỔI KHÍ', wfw: 'TRAO ĐỔI NƯỚC, THỨC ĂN VÀ CHẤT THẢI' },
      placed: 'Đã đặt chuột bạch. Hãy tìm hiểu sự trao đổi chất của chuột với môi trường.',
      /* what the student is told when a drop is wrong (md sections 14, 19, 22, 26, 29, 33, 36, 51) */
      msg: {
        mouseFirst: 'Hãy kéo chuột bạch lên bàn quan sát để bắt đầu.',
        mouseOff: 'Hãy đặt chuột bạch vào khu vực quan sát.',
        foodOff: 'Hãy đặt thức ăn gần chuột.',
        waterOff: 'Hãy đặt bát nước gần chuột.',
        o2Wrong: 'Chưa đúng. Hãy đưa O₂ từ môi trường vào cơ thể chuột.',
        co2Wrong: 'Chưa đúng. Khi hô hấp, chuột thải CO₂ ra môi trường.',
        wasteWrong: 'Chưa đúng. Chất cặn bã là chất được cơ thể thải ra môi trường.',
        urineWrong: 'Chưa đúng. Nước tiểu là chất được cơ thể thải ra môi trường.'
      },
      /* the task shown before each move (md sections 18, 20, 25, 27, 31, 34) */
      prompt: {
        o2Task: 'Hãy kéo khí O₂ từ môi trường vào cơ thể chuột.',
        co2Ask: 'Chuột thải khí nào ra môi trường khi hô hấp?',
        co2Task: 'Hãy kéo CO₂ từ phổi ra môi trường.',
        foodTask: 'Hãy cung cấp thức ăn cho chuột.',
        waterTask: 'Hãy cung cấp nước cho chuột.',
        wasteTask: 'Sau khi sử dụng thức ăn, cơ thể thải chất cặn bã. Hãy xác định chất được thải ra môi trường.',
        urineTask: 'Hãy đưa nước tiểu ra khỏi cơ thể chuột.'
      },
      resp: {
        mode: 'HÔ HẤP', view: 'MŨI → ĐƯỜNG HÔ HẤP → PHỔI', info: 'Chuột lấy khí oxygen (O₂) từ môi trường để hô hấp và thải khí carbon dioxide (CO₂) ra môi trường.',
        o2Path: 'MÔI TRƯỜNG → MŨI → ĐƯỜNG HÔ HẤP → PHỔI', co2Path: 'PHỔI → ĐƯỜNG HÔ HẤP → MÔI TRƯỜNG',
        noPhoto: 'Chuột là động vật nên không thực hiện quang hợp.'
      },
      right: {
        o2: { text: 'Chính xác! Chuột lấy khí O₂ từ môi trường để hô hấp.', mark: 'O₂ VÀO ✓' },
        co2: { text: 'Chính xác! Chuột thải khí CO₂ ra môi trường.', mark: 'CO₂ RA ✓' },
        food: { text: 'Chuột lấy thức ăn từ môi trường để cung cấp chất dinh dưỡng cho cơ thể.', mark: 'THỨC ĂN ✓', anim: 'ĂN → NHAI → NUỐT' },
        water: { text: 'Chuột lấy nước từ môi trường để duy trì hoạt động của cơ thể.', mark: 'NƯỚC ✓' },
        waste: { text: 'Đúng! Cơ thể thải chất cặn bã ra môi trường.', mark: 'CHẤT CẶN BÃ ✓' },
        urine: { text: 'Chính xác! Chuột thải nước tiểu ra môi trường.', mark: 'NƯỚC TIỂU ✓' }
      },
      airDone: {
        mark: 'TRAO ĐỔI KHÍ ✓', in: 'O₂: MÔI TRƯỜNG → CHUỘT', out: 'CO₂: CHUỘT → MÔI TRƯỜNG',
        text: 'Chuột thường xuyên trao đổi khí với môi trường: lấy O₂ vào cơ thể và thải CO₂ ra môi trường.'
      },
      wfw: {
        intro: 'Động vật lấy nước và thức ăn từ môi trường. Sau khi sử dụng, cơ thể thải các chất cặn bã và nước tiểu ra môi trường.',
        later: 'MỘT KHOẢNG THỜI GIAN SAU...', wasteArea: 'CHẤT CẶN BÃ', urineLabel: 'NƯỚC TIỂU',
        done: 'TRAO ĐỔI NƯỚC, THỨC ĂN VÀ CHẤT THẢI ✓',
        text: 'Chuột lấy nước và thức ăn từ môi trường, sau đó thải các chất cặn bã và nước tiểu ra môi trường.'
      },
      info: { head: ['Thông tin', 'Chuột bạch'], rows: [['Loài', 'Chuột bạch'], ['Giai đoạn', 'Trưởng thành'], ['Tình trạng', 'Khỏe mạnh']], close: 'ĐÓNG' },
      /* the labels the magnifier can show (md section 54) */
      labels: { lungs: 'PHỔI', o2: 'O₂', co2: 'CO₂', food: 'THỨC ĂN', water: 'NƯỚC', waste: 'CHẤT CẶN BÃ', urine: 'NƯỚC TIỂU' },
      result: {
        title: 'KẾT QUẢ QUAN SÁT',
        inFlows: ['MÔI TRƯỜNG → O₂ → CHUỘT', 'MÔI TRƯỜNG → NƯỚC → CHUỘT', 'MÔI TRƯỜNG → THỨC ĂN → CHUỘT'],
        outFlows: ['CHUỘT → CO₂ → MÔI TRƯỜNG', 'CHUỘT → CHẤT CẶN BÃ → MÔI TRƯỜNG', 'CHUỘT → NƯỚC TIỂU → MÔI TRƯỜNG'],
        diagram: ['MÔI TRƯỜNG', 'O₂ + NƯỚC + THỨC ĂN', 'CHUỘT BẠCH', 'CO₂ + CHẤT CẶN BÃ + NƯỚC TIỂU', 'MÔI TRƯỜNG']
      },
      conclusion: 'Động vật thường xuyên trao đổi chất với môi trường. Chúng lấy khí O₂, nước và thức ăn từ môi trường để duy trì sự sống và hoạt động. Sau đó, cơ thể thải khí CO₂, chất cặn bã và nước tiểu ra môi trường.',
      keywords: ['O₂ – NƯỚC – THỨC ĂN', 'CO₂ – CHẤT CẶN BÃ – NƯỚC TIỂU'],
      summary: {
        head: ['Hoạt động', 'Chất', 'Hướng trao đổi'],
        rows: [
          ['Hô hấp', 'O₂', 'Môi trường → Chuột'], ['Hô hấp', 'CO₂', 'Chuột → Môi trường'], ['Uống nước', 'Nước', 'Môi trường → Chuột'],
          ['Ăn', 'Thức ăn', 'Môi trường → Chuột'], ['Thải', 'Chất cặn bã', 'Chuột → Môi trường'], ['Thải', 'Nước tiểu', 'Chuột → Môi trường']
        ]
      },
      finish: {
        title: 'THÍ NGHIỆM HOÀN THÀNH!', sub: 'CHUỘT BẠCH ĐÃ TRAO ĐỔI CHẤT VỚI MÔI TRƯỜNG',
        lines: ['Môi trường → O₂ → Chuột', 'Môi trường → Nước → Chuột', 'Môi trường → Thức ăn → Chuột', 'Chuột → CO₂ → Môi trường', 'Chuột → Chất cặn bã → Môi trường', 'Chuột → Nước tiểu → Môi trường'],
        replay: 'XEM LẠI TƯƠNG TÁC', controls: ['DỪNG', 'TIẾP TỤC', 'XEM LẠI']
      }
    },

    app: {
      titlePrefix: 'THÍ NGHIỆM 4: ',
      help: [
        'Kéo chuột bạch từ khay bên trái, thả lên bàn quan sát. Hai nội dung sẽ được mở khóa.',
        'Nhấp vào chuột để xem thông tin.',
        'Chọn TRAO ĐỔI KHÍ hoặc TRAO ĐỔI NƯỚC, THỨC ĂN VÀ CHẤT THẢI. Em có thể làm nội dung nào trước cũng được.',
        'Làm theo yêu cầu trên màn hình: kéo khí vào hoặc ra khỏi cơ thể chuột, đặt thức ăn và bát nước gần chuột, đưa chất cặn bã và nước tiểu ra ngoài.',
        'Kéo kính phóng đại đến chuột hoặc các vật xung quanh để nhìn rõ hơn. Bấm LÀM LẠI THÍ NGHIỆM bất cứ lúc nào để chơi lại từ đầu.'
      ],
      chooseTopic: 'CHỌN NỘI DUNG',
      chooseWfw: 'Hãy chọn TRAO ĐỔI NƯỚC, THỨC ĂN VÀ CHẤT THẢI trước nhé.',
      magOff: 'Hãy đưa kính phóng đại đến chuột hoặc các vật xung quanh.',
      magOn: 'Kính phóng đại đang cho em nhìn gần hơn. Nhấp vào kính để cất đi.',
      tapMouse: 'Nhấp vào chuột để xem thông tin.',
      nextAir: 'Hãy tiếp tục tìm hiểu sự trao đổi khí của chuột.',
      nextWfw: 'Hãy tiếp tục tìm hiểu sự trao đổi nước, thức ăn và chất thải của chuột.',
      tapWaste: 'Nhấp vào chất cặn bã hoặc kéo ra khu vực thải.',
      backToTable: 'VỀ BÀN QUAN SÁT',
      learnedTitle: 'BẢNG TỔNG HỢP',
      conclusionTitle: 'KẾT LUẬN',
      busy: 'Em chờ chuột một chút nhé.',
      alreadyDone: 'Em đã hoàn thành phần này rồi.'
    }
  };
})(window.Lab);
