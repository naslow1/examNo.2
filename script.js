// ── Размер одежды ──
const sizeBtns = document.querySelectorAll('.size-btn');
const clothesValue = document.getElementById('clothesValue');

sizeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    sizeBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    clothesValue.value = btn.dataset.value;
  });
});

// ── Ползунок страха ──
const fearSlider = document.getElementById('fear');
const fearDisplay = document.getElementById('fearDisplay');

if (fearSlider) {
  fearSlider.addEventListener('input', () => {
    fearDisplay.textContent = fearSlider.value;
  });
}

// ── Отправка формы ──
const form = document.getElementById('examForm');
const result = document.getElementById('result');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Собираем данные
  const data = {
    head: document.getElementById('head').value,
    height: document.getElementById('height').value,
    clothes: clothesValue.value,
    shoes: document.getElementById('shoes').value,
    fear: fearSlider.value,
    expectations: document.getElementById('expectations').value,
    message: document.getElementById('message').value,
  };

  // Проверяем размер одежды
  if (!data.clothes) {
    alert('Выберите размер одежды');
    return;
  }

  // Настройка кнопки
  const submitBtn = form.querySelector('.submit-btn');
  const btnText = submitBtn.querySelector('.submit-btn__text');
  const originalText = btnText.textContent;
  btnText.textContent = 'Сдаём...';
  submitBtn.disabled = true;

  // Данные для Telegram
  const token = '8850557260:AAGYhYOwtkut1u6NW5uCNe_yBgK548cPi9U';
  const chatId = '934958697';
  const message = `🏁 Новая анкета на мото-интенсив!\n\n` +
                  `👤 Голова: ${data.head} см\n` +
                  `📏 Рост: ${data.height} см\n` +
                  `👕 Размер: ${data.clothes}\n` +
                  `👟 Обувь: ${data.shoes}\n` +
                  `😨 Страх: ${data.fear}/10\n` +
                  `🎯 Ожидания: "${data.expectations}"\n` +
                  `💬 Сообщение: "${data.message}"`;

  try {
    // Отправка в Telegram
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: message })
    });

    if (response.ok) {
      // Успешный результат
      form.style.display = 'none';
      result.style.display = 'block';
      result.querySelector('.result__sub').textContent = 'Допуск выдан! Данные переданы инструктору, ждём на треке.';
      result.scrollIntoView({ behavior: 'smooth' });
    } else {
      throw new Error('Telegram error');
    }

  } catch (err) {
    // Обработка ошибки
    alert('Произошла ошибка при отправке. Проверьте интернет.');
    btnText.textContent = originalText;
    submitBtn.disabled = false;
  }
});