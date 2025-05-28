<?php

function makeGif($input, $output, $session) {
    $scale = 320;
    $text = $session['text'] ?? '';
    $position = $session['position'] ?? 'پایین';
    $size_map = ['کوچک' => 14, 'متوسط' => 24, 'بزرگ' => 36];
    $font_size = $size_map[$session['size'] ?? 'متوسط'];

    $drawtext = '';
    if (!empty($text)) {
        $y = match($position) {
            'بالا' => 'h*0.1',
            'وسط' => '(h-text_h)/2',
            'پایین' => 'h-text_h-10',
            default => 'h-text_h-10'
        };

        // فونت دلخواه خودتو جایگزین کن
        $fontfile = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf";
        $drawtext = ":drawtext=fontfile=$fontfile:text='" . addslashes($text) . "':x=(w-text_w)/2:y=$y:fontsize=$font_size:fontcolor=white:bordercolor=black:borderw=2";
    }

    if ($session['type'] === 'photo') {
        exec("ffmpeg -loop 1 -i $input -t 3 -vf scale=$scale:-1$drawtext -y $output");
    } else {
        exec("ffmpeg -i $input -t 10 -vf scale=$scale:-1$drawtext -y $output");
    }
}
