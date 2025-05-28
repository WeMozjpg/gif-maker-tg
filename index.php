<?php

$token = '7284176713:AAEXKs1-2X-2LUk9AiEXTVINBCybdursGiM';
$api = "https://api.telegram.org/bot$token/";

$content = file_get_contents("php://input");
$update = json_decode($content, true);
if (!$update) exit;

$chat_id = $update['message']['chat']['id'];
$message_id = $update['message']['message_id'];
$text = $update['message']['text'] ?? '';
$photo = $update['message']['photo'] ?? null;
$video = $update['message']['video'] ?? null;

$session_file = "sessions/$chat_id.json";
$session = file_exists($session_file) ? json_decode(file_get_contents($session_file), true) : [];

function saveSession($chat_id, $data) {
    file_put_contents("sessions/$chat_id.json", json_encode($data));
}

function clearSession($chat_id) {
    @unlink("sessions/$chat_id.json");
}

function sendMessage($chat_id, $text, $buttons = []) {
    global $api;
    $payload = ['chat_id' => $chat_id, 'text' => $text];
    if ($buttons) {
        $payload['reply_markup'] = json_encode(['keyboard' => $buttons, 'resize_keyboard' => true]);
    }
    file_get_contents($api . "sendMessage?" . http_build_query($payload));
}

// مرحله شروع
if ($text == '/start') {
    clearSession($chat_id);
    sendMessage($chat_id, "سلام! لطفاً عکس یا ویدیوی کمتر از 10 ثانیه ارسال کن.");
    exit;
}

// اگر فایل فرستاد
if ($photo || $video) {
    $session = ['type' => $photo ? 'photo' : 'video'];
    $file_id = $photo ? end($photo)['file_id'] : $video['file_id'];
    $session['file_id'] = $file_id;
    saveSession($chat_id, $session);
    sendMessage($chat_id, "می‌خوای روی گیف متن باشه؟", [
        [['بله'], ['نه']]
    ]);
    exit;
}

// اگر کاربر جواب بله یا نه داد
if (isset($session['file_id']) && !isset($session['text_decision'])) {
    if ($text == 'بله') {
        $session['text_decision'] = true;
        saveSession($chat_id, $session);
        sendMessage($chat_id, "لطفاً متن مورد نظر برای گیف رو بفرست:");
    } elseif ($text == 'نه') {
        $session['text_decision'] = false;
        saveSession($chat_id, $session);
        generateAndSendGif($chat_id, $session);
        clearSession($chat_id);
    }
    exit;
}

// اگر متن فرستاد و قراره متن باشه
if (isset($session['text_decision']) && $session['text_decision'] === true && !isset($session['text'])) {
    $session['text'] = $text;
    saveSession($chat_id, $session);
    sendMessage($chat_id, "مکان قرارگیری متن رو انتخاب کن:", [
        [['بالا'], ['وسط'], ['پایین']]
    ]);
    exit;
}

// انتخاب مکان متن
if (isset($session['text']) && !isset($session['position']) && in_array($text, ['بالا', 'وسط', 'پایین'])) {
    $session['position'] = $text;
    saveSession($chat_id, $session);
    sendMessage($chat_id, "سایز متن رو انتخاب کن:", [
        [['کوچک'], ['متوسط'], ['بزرگ']]
    ]);
    exit;
}

// انتخاب سایز متن و ساخت نهایی
if (isset($session['position']) && !isset($session['size']) && in_array($text, ['کوچک', 'متوسط', 'بزرگ'])) {
    $session['size'] = $text;
    saveSession($chat_id, $session);
    generateAndSendGif($chat_id, $session);
    clearSession($chat_id);
    exit;
}

function generateAndSendGif($chat_id, $session) {
    global $api, $token;

    $file_info = json_decode(file_get_contents($api . "getFile?file_id=" . $session['file_id']), true);
    $file_path = $file_info['result']['file_path'];
    $url = "https://api.telegram.org/file/bot$token/$file_path";

    $local_input = "uploads/" . basename($file_path);
    file_put_contents($local_input, file_get_contents($url));

    $gif_path = 'uploads/' . uniqid() . '.gif';
    include 'gif_maker.php';
    makeGif($local_input, $gif_path, $session);

    $curl = curl_init();
    curl_setopt_array($curl, [
        CURLOPT_URL => $api . "sendDocument",
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => [
            'chat_id' => $chat_id,
            'document' => new CURLFile(realpath($gif_path))
        ]
    ]);
    curl_exec($curl);
    curl_close($curl);

    @unlink($local_input);
    @unlink($gif_path);
}
