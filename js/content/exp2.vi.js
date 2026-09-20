/* Experiment 2 – all Vietnamese wording.
   • `md`  = copied word for word from "THÍ NGHIỆM 1909.md" (a test checks this, so typos cannot slip in).
   • `app` = short helper messages the md does not specify (marked so you can find and edit them).
   You can edit any text here without touching the program logic. */
(function (Lab) {
  'use strict';
  Lab.content.exp2 = {
    md: {
      title: 'TÌM HIỂU SỰ TRAO ĐỔI KHÍ, NƯỚC VÀ CHẤT KHOÁNG CỦA THỰC VẬT VỚI MÔI TRƯỜNG',
      steps: ['CÂY RAU CẢI', 'TRAO ĐỔI KHÍ', 'TRAO ĐỔI NƯỚC VÀ CHẤT KHOÁNG', 'HOÀN THÀNH'],
      stateNames: { locked: 'Chưa mở', active: 'Đang thực hiện', done: 'Đã hoàn thành' },
      tray: { pot: 'Chậu cây rau cải', water: 'Bình tưới nước', minerals: 'Túi/khay đất có chất khoáng', magnifier: 'Kính phóng đại', box: 'Hộp trong suốt' },
      topics: { air: 'TRAO ĐỔI KHÍ', water: 'TRAO ĐỔI NƯỚC VÀ CHẤT KHOÁNG' },
      subs: { resp: 'HÔ HẤP', photo: 'QUANG HỢP', water: 'NƯỚC', minerals: 'CHẤT KHOÁNG' },
      placed: 'Đã đặt cây rau cải. Hãy chọn nội dung em muốn quan sát.',
      msg: {
        potOff: 'Hãy đặt cây rau cải lên bàn quan sát.',
        respWrongIn: 'Chưa đúng. Khi hô hấp, cây lấy khí ôxi từ môi trường.',
        respWrongOut: 'Chưa đúng. Hãy xác định khí cây thải ra khi hô hấp.',
        waterWrong: 'Hãy tưới nước vào đất để cây có thể hấp thụ nước.',
        mineralsWrong: 'Chưa đúng. Chất khoáng được rễ hấp thụ từ đất.'
      },
      /* the three parts of the plant to click (md sections 11–13) */
      parts: {
        leaf: { tag: 'LÁ CÂY', text: 'Lá là cơ quan quan trọng giúp cây trao đổi khí với môi trường và thực hiện quang hợp.' },
        stem: { tag: 'THÂN CÂY', text: 'Thân giúp nâng đỡ cây và vận chuyển nước, chất khoáng đến các bộ phận của cây.' },
        soil: { tag: 'MẶT CẮT ĐẤT', text: 'Rễ hấp thụ nước và chất khoáng từ đất.' }
      },
      modes: { leaf: 'QUAN SÁT LÁ CÂY', root: 'CHẾ ĐỘ QUAN SÁT BỘ RỄ' },
      gas: { o2: 'O₂ – KHÍ ÔXI', co2: 'CO₂ – KHÍ CACBONIC' },
      /* the task shown before each move (md sections 17, 19, 24, 26) */
      prompt: {
        respPrompt1: 'Hãy kéo khí mà cây lấy vào khi hô hấp vào lá cây.',
        respPrompt2: 'Hãy kéo khí mà cây thải ra khi hô hấp ra môi trường.',
        photoPrompt1: 'Hãy kéo khí cây lấy vào khi quang hợp vào lá.',
        photoPrompt2: 'Cây thải khí gì ra môi trường khi quang hợp? Hãy kéo khí đó từ lá ra ngoài.'
      },
      /* after a right move: the moving arrow's words and the feedback (md sections 18, 20, 25, 27) */
      right: {
        respIn: { arrow: 'MÔI TRƯỜNG → O₂ → LÁ', text: 'Chính xác! Khi hô hấp, cây lấy khí ôxi từ môi trường.' },
        respOut: { arrow: 'LÁ → CO₂ → MÔI TRƯỜNG', text: 'Chính xác! Khi hô hấp, cây thải khí cacbonic ra môi trường.' },
        photoIn: { arrow: 'MÔI TRƯỜNG → CO₂ → LÁ', text: 'Chính xác! Cây lấy khí cacbonic từ môi trường để quang hợp.' },
        photoOut: { arrow: 'LÁ → O₂ → MÔI TRƯỜNG', text: 'Chính xác! Cây thải khí ôxi ra môi trường khi quang hợp.' }
      },
      resp: { done: 'ĐÃ HOÀN THÀNH QUAN SÁT HÔ HẤP ✓', diagram: 'O₂ → CÂY → CO₂', text: 'Cây lấy khí ôxi từ môi trường để hô hấp và thải khí cacbonic ra môi trường.' },
      photo: {
        done: 'ĐÃ HOÀN THÀNH QUAN SÁT QUANG HỢP ✓', diagram: 'CO₂ → LÁ → O₂', running: 'Quang hợp đang diễn ra.',
        text: 'Cây sử dụng ánh sáng, khí cacbonic và nước để tạo chất dinh dưỡng, đồng thời thải khí ôxi ra môi trường.'
      },
      airDone: { mark: 'TRAO ĐỔI KHÍ ✓', text: 'Em đã quan sát được hai quá trình trao đổi khí của cây: hô hấp và quang hợp.', next: 'Hãy tiếp tục tìm hiểu sự trao đổi nước và chất khoáng của cây.' },
      /* water and minerals (md sections 31–38) */
      wm: {
        diagram: 'ĐẤT → RỄ → THÂN → LÁ', intro: 'Rễ cây hấp thụ nước và chất khoáng từ đất.', arrow: 'RỄ → THÂN → LÁ',
        waterPrompt: 'Hãy tưới nước vào đất để quan sát cách cây hấp thụ và vận chuyển nước.',
        waterRight: 'Đúng! Rễ hấp thụ nước từ đất.', waterText: 'Nước được rễ hấp thụ và vận chuyển đến các bộ phận của cây.', waterMark: 'NƯỚC ✓',
        mineralsPrompt: 'Hãy đưa chất khoáng đến khu vực rễ cây.', mineralsTool: 'TÚI/KHAY ĐẤT CÓ CHẤT KHOÁNG',
        mineralsRight: 'Chính xác! Rễ hấp thụ chất khoáng từ đất.', mineralsMark: 'CHẤT KHOÁNG ✓',
        done: 'HOÀN THÀNH TRAO ĐỔI NƯỚC VÀ CHẤT KHOÁNG ✓',
        text: 'Nước và chất khoáng được rễ hấp thụ từ đất và vận chuyển đến các bộ phận của cây.'
      },
      finish: { mark: 'HOÀN THÀNH ✓', synthesis: 'TƯƠNG TÁC TỔNG HỢP', review: 'XEM LẠI TƯƠNG TÁC TỔNG HỢP', title: 'THÍ NGHIỆM HOÀN THÀNH!', conclusionTitle: 'KẾT LUẬN' },
      /* the four flows shown together (md section 40) */
      flows: {
        air: 'Trao đổi khí', resp: 'HÔ HẤP', respFlow: 'MÔI TRƯỜNG → O₂ → CÂY → CO₂ → MÔI TRƯỜNG',
        photo: 'Quang hợp', photoFlow: 'MÔI TRƯỜNG → CO₂ → LÁ → O₂ → MÔI TRƯỜNG',
        water: 'Trao đổi nước', minerals: 'Trao đổi chất khoáng', soilFlow: 'ĐẤT → RỄ → THÂN → LÁ'
      },
      conclusion: 'Cây rau cải luôn trao đổi chất với môi trường. Trong hô hấp, cây lấy khí ôxi và thải khí cacbonic. Trong quang hợp, cây lấy khí cacbonic, sử dụng ánh sáng và nước để tạo chất dinh dưỡng, đồng thời thải khí ôxi. Rễ cây hấp thụ nước và chất khoáng từ đất, sau đó nước và chất khoáng được vận chuyển đến các bộ phận của cây.',
      summary: {
        head: ['Quá trình', 'Cây lấy vào', 'Cây thải ra / vận chuyển'],
        rows: [
          ['Hô hấp', 'Khí ôxi (O₂)', 'Khí cacbonic (CO₂)'],
          ['Quang hợp', 'Khí cacbonic (CO₂), nước và ánh sáng', 'Khí ôxi (O₂)'],
          ['Hấp thụ nước', 'Nước từ đất', 'Nước được vận chuyển đến các bộ phận'],
          ['Hấp thụ chất khoáng', 'Chất khoáng từ đất', 'Chất khoáng được vận chuyển đến các bộ phận']
        ]
      },
      learned: [
        'Cây trao đổi khí với môi trường.',
        'Cây hấp thụ nước và chất khoáng từ đất.',
        'Nước và chất khoáng được vận chuyển đến các bộ phận của cây.',
        'Hô hấp và quang hợp là hai quá trình trao đổi khí quan trọng của cây.',
        'Cây sử dụng ánh sáng, nước và khí cacbonic trong quá trình quang hợp và thải khí ôxi ra môi trường.'
      ]
    },

    app: {
      titlePrefix: 'THÍ NGHIỆM 2: ',
      help: [
        'Kéo chậu cây rau cải từ khay bên trái, thả lên bàn quan sát. Hai nội dung sẽ được mở khóa.',
        'Nhấp vào lá, thân hoặc đất của cây để tìm hiểu từng bộ phận.',
        'Chọn TRAO ĐỔI KHÍ hoặc TRAO ĐỔI NƯỚC VÀ CHẤT KHOÁNG. Em có thể làm nội dung nào trước cũng được.',
        'Làm theo yêu cầu trên màn hình: kéo khí vào hoặc ra khỏi lá, tưới nước vào đất, đưa chất khoáng đến rễ.',
        'Kéo kính phóng đại đến lá, thân hoặc đất để nhìn rõ hơn. Bấm LÀM LẠI THÍ NGHIỆM bất cứ lúc nào để chơi lại từ đầu.'
      ],
      chooseTopic: 'CHỌN NỘI DUNG',
      zoneSoil: 'ĐẤT / RỄ',
      backToTable: 'VỀ BÀN QUAN SÁT',
      chooseProcess: 'Hãy chọn HÔ HẤP hoặc QUANG HỢP trước nhé.',
      chooseGas: 'Chọn một quá trình',
      choosePart: 'Chọn một phần',
      tapParts: 'Nhấp vào lá, thân hoặc đất để tìm hiểu.',
      photoWrongIn: 'Chưa đúng. Khi quang hợp, cây lấy khí cacbonic từ môi trường.',
      photoWrongOut: 'Chưa đúng. Hãy xác định khí cây thải ra khi quang hợp.',
      waterWhen: 'Hãy chọn TRAO ĐỔI NƯỚC VÀ CHẤT KHOÁNG, rồi chọn NƯỚC trước nhé.',
      mineralsWhen: 'Hãy chọn TRAO ĐỔI NƯỚC VÀ CHẤT KHOÁNG, rồi chọn CHẤT KHOÁNG trước nhé.',
      magOff: 'Hãy đưa kính phóng đại đến cây.',
      boxOff: 'Hãy úp hộp trong suốt lên cây.',
      boxOn: 'Hộp trong suốt giúp em quan sát khí quanh cây. Nhấp vào hộp để nhấc ra.',
      boxLifted: 'Đã nhấc hộp trong suốt ra.',
      magLeaf: 'Kính phóng đại cho thấy gân lá rõ hơn. Nhấp vào kính để cất đi.',
      magStem: 'Kính phóng đại cho thấy thân cây rõ hơn. Nhấp vào kính để cất đi.',
      magSoil: 'Kính phóng đại cho thấy rễ trong đất rõ hơn. Nhấp vào kính để cất đi.',
      nextAir: 'Hãy tiếp tục tìm hiểu sự trao đổi khí của cây.',
      waterDoneNext: 'Em đã tưới nước. Hãy chọn CHẤT KHOÁNG.',
      mineralsDoneNext: 'Em đã đưa chất khoáng đến rễ. Hãy chọn NƯỚC.',
      alreadyDone: 'Em đã hoàn thành phần này rồi.',
      dragHint: 'Kéo một phân tử khí trên màn hình.',
      learnedTitle: 'EM ĐÃ HIỂU ĐƯỢC',
      tableTitle: 'BẢNG TỔNG KẾT KIẾN THỨC',
      soilDry: 'Đất đang khô.',
      idleBox: 'Hộp trong suốt'
    }
  };
})(window.Lab);
