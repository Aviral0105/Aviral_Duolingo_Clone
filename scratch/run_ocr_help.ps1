. ./scratch/ocr_all.ps1
$frames = Get-ChildItem scratch/frames_024319/*.jpg | Sort-Object Name
$out = @()
foreach ($f in $frames) {
    $txt = Get-OcrText $f.FullName
    $out += "=== " + $f.Name + " ==="
    $out += $txt
    $out += ""
}
$out | Out-File -Encoding utf8 scratch/ocr_help_video.txt
Write-Host "OCR complete! Written to scratch/ocr_help_video.txt"
