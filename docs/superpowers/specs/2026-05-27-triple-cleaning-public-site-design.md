# Triple Cleaning Public Site Design

## Goal

Build a public English website for Triple Cleaning with service descriptions, prices, included cleaning tasks, and a booking request flow that marks new requests as Pending Approval.

## Visual Direction

The site should follow the provided logo: elegant residential cleaning, warm white background, soft charcoal text, thin linework, and restrained champagne-gold accents. The design should feel premium, calm, feminine, trustworthy, and easy to read.

## Pages And Sections

This first version is a single-page public website with these sections:

- Header with logo and navigation links: Services, Pricing, What's Included, Book, Contact.
- Hero with the headline "Residential Cleaning Services" and a primary "Request a Booking" action.
- Services overview for Standard Cleaning, Deep Cleaning, and Move In / Move Out Cleaning.
- Pricing table with service, home size, duration, and price.
- What's Included sections with detailed lists for each cleaning type.
- Booking request section with service, home size, date, time, customer contact, and notes fields.
- Contact footer with triplecleaning.info@gmail.com.

## Pricing

Standard Cleaning:

- 2 Bedrooms, 2 hr 30 min, EUR 80
- 3 Bedrooms, 3 hr, EUR 100
- 4 Bedrooms, 3 hr 30 min, EUR 130

Deep Cleaning:

- 2 Bedrooms, 3 hr, EUR 140
- 3 Bedrooms, 3 hr 30 min, EUR 160
- 4 Bedrooms, 4 hr, EUR 190

Move In / Move Out Cleaning:

- 2 Bedrooms, 4 hr, EUR 160
- 3 Bedrooms, 5 hr, EUR 210
- 4 Bedrooms, 6 hr, EUR 250

## Booking Flow

The booking form accepts Saturday and Sunday requests between 09:00 and 18:00. Submissions are not confirmed immediately. The confirmation state is Pending Approval, and the page shows that the team will review the request manually.

This static version prepares the frontend flow and email request body. A backend/admin approval system and Google Calendar insertion can be connected later without changing the public information architecture.

## Technical Approach

Use a static HTML/CSS/JavaScript site because the current machine does not have working Node/npm. Store service data in JavaScript, render pricing and booking summary from that data, and use a mailto fallback to send the pending request to triplecleaning.info@gmail.com. Use the supplied Triple Cleaning PNG logo as the brand asset.

## Verification

Use a PowerShell test script to verify required files, visible service/pricing content, booking constraints, pending approval wording, and email address. Open the final HTML page locally for visual and interaction review.
