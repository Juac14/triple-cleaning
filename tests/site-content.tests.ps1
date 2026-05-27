$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$failures = New-Object System.Collections.Generic.List[string]

function Assert-FileExists($path) {
    if (-not (Test-Path -LiteralPath $path)) {
        $failures.Add("Missing file: $path")
    }
}

function Assert-Contains($content, $needle, $label) {
    if ($content -notlike "*$needle*") {
        $failures.Add("Missing ${label}: $needle")
    }
}

$indexPath = Join-Path $root "index.html"
$stylePath = Join-Path $root "styles.css"
$scriptPath = Join-Path $root "script.js"
$logoPath = Join-Path $root "assets/logo.png"
$croppedLogoPath = Join-Path $root "assets/logo-cropped.png"
$heroPath = Join-Path $root "assets/hero-clean-home.png"

Assert-FileExists $indexPath
Assert-FileExists $stylePath
Assert-FileExists $scriptPath
Assert-FileExists $logoPath
Assert-FileExists $croppedLogoPath
Assert-FileExists $heroPath

if ($failures.Count -eq 0) {
    $index = Get-Content -LiteralPath $indexPath -Raw
    $styles = Get-Content -LiteralPath $stylePath -Raw
    $script = Get-Content -LiteralPath $scriptPath -Raw
    $all = "$index`n$styles`n$script"

    Assert-Contains $all "Residential Cleaning Services" "hero headline"
    Assert-Contains $all "triplecleaning.info@gmail.com" "contact email"
    Assert-Contains $all "Pending Approval" "booking status"
    Assert-Contains $all "0892721358" "WhatsApp contact number"
    Assert-Contains $all "Send" "single WhatsApp send button"
    Assert-Contains $all "wa.me/353892721358" "WhatsApp message link"
    Assert-Contains $all "Open WhatsApp with your request ready to send." "WhatsApp booking instructions"
    if ($all -like "*Please confirm availability by WhatsApp*") {
        $failures.Add("WhatsApp request message should not include internal confirmation instruction.")
    }
    Assert-Contains $all "Please complete the highlighted fields." "booking validation"
    Assert-Contains $all "formStatus" "visible booking status"
    Assert-Contains $all "button" "direct booking button"
    Assert-Contains $all "renderBookingCalendar" "weekend calendar rendering"
    Assert-Contains $all "calendar-day" "calendar day controls"
    Assert-Contains $all "formatDateValue" "local date formatting"
    Assert-Contains $all "Only Saturdays and Sundays are available." "weekend date label"
    Assert-Contains $all "Saturday" "weekend availability"
    Assert-Contains $all "Sunday" "weekend availability"
    Assert-Contains $all "09:00" "start time"
    Assert-Contains $all "18:00" "end time"

    $requiredContent = @(
        "Standard Cleaning",
        "Deep Cleaning",
        "Move In / Move Out Cleaning",
        "Regular maintenance cleaning to keep your home fresh, tidy, and comfortable.",
        "A more detailed and intensive cleaning focused on built-up dirt and hard-to-reach areas.",
        "Complete top-to-bottom cleaning for empty properties before moving in or after moving out.",
        "2 Bedrooms",
        "3 Bedrooms",
        "4 Bedrooms",
        "2 hr 30 min",
        "3 hr 30 min",
        "EUR 80",
        "EUR 100",
        "EUR 130",
        "EUR 140",
        "EUR 160",
        "EUR 190",
        "EUR 210",
        "EUR 250",
        "Dusting all accessible surfaces",
        "Interior window cleaning",
        "Inside oven, fridge, and appliances",
        "Removal of construction dust"
    )

    foreach ($item in $requiredContent) {
        Assert-Contains $all $item "required site content"
    }
}

if ($failures.Count -gt 0) {
    Write-Host "Site content checks failed:"
    foreach ($failure in $failures) {
        Write-Host "- $failure"
    }
    exit 1
}

Write-Host "Site content checks passed."
