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
    Assert-Contains $all 'data-netlify="true"' "Netlify form marker"
    Assert-Contains $all 'name="form-name"' "Netlify form name field"
    Assert-Contains $all "submitBookingCopy" "Netlify form copy submission"
    Assert-Contains $all "booking-request" "Netlify booking form name"
    Assert-Contains $all "0892721358" "WhatsApp contact number"
    Assert-Contains $all "Send" "single WhatsApp send button"
    Assert-Contains $all "wa.me/353892721358" "WhatsApp message link"
    Assert-Contains $all "Open WhatsApp with your request ready to send." "WhatsApp booking instructions"
    if ($all -like "*Please confirm availability by WhatsApp*") {
        $failures.Add("WhatsApp request message should not include internal confirmation instruction.")
    }
    Assert-Contains $all "Please complete the highlighted fields." "booking validation"
    Assert-Contains $all 'id="bathrooms"' "full bathrooms field"
    Assert-Contains $all 'name="bathrooms"' "full bathrooms form value"
    Assert-Contains $all 'id="firstVisit"' "first visit field"
    Assert-Contains $all 'name="first_visit"' "first visit form value"
    Assert-Contains $all 'Full bathrooms: ${fields.get("bathrooms")}' "full bathrooms request message"
    Assert-Contains $all 'full_bathrooms: fields.get("bathrooms")' "full bathrooms Netlify submission"
    Assert-Contains $all "extraBathrooms * selectedService().extraBathroomFee" "extra bathroom price calculation"
    Assert-Contains $all "extraBathroomFee: 30" "standard and deep extra bathroom fee"
    Assert-Contains $all "extraBathroomFee: 0" "no extra bathroom fee for move cleaning"
    if ($all -like '*firstVisitFee*' -or $all -like '*First visit fee*') {
        $failures.Add("First visits should not add a fee.")
    }
    Assert-Contains $all 'Final price: ${formatPrice(price.total)}' "final booking price"
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
    Assert-Contains $all "Estimated time" "estimated time table heading"

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
        "5 Bedrooms",
        "Bedrooms / Office / Playroom / TV Room",
        "Depending on size of the house/apartment and number of bathrooms",
        "Estimated time",
        "Full Bathrooms",
        "This is my first visit",
        "€ 80.00",
        "€ 100.00",
        "€ 130.00",
        "€ 140.00",
        "€ 180.00",
        "€ 210.00",
        "€ 300.00",
        "€ 360.00",
        "€ 420.00",
        "€ 160.00",
        "€ 240.00 - € 300.00",
        "€ 480.00",
        "Dusting all accessible surfaces",
        "Deep cleaning of bathrooms and kitchens, including cabinets (exterior)",
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
