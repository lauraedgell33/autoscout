<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Contract - {{ $contractNumber }}</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 20px;
        }
        
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 3px solid #2c3e50;
            padding-bottom: 20px;
        }
        
        .header h1 {
            margin: 0;
            color: #2c3e50;
            font-size: 28px;
        }
        
        .header p {
            margin: 5px 0;
            font-size: 12px;
            color: #7f8c8d;
        }
        
        .contract-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
            font-size: 12px;
        }
        
        .info-box {
            flex: 1;
        }
        
        .info-label {
            font-weight: bold;
            color: #2c3e50;
            margin-top: 10px;
        }
        
        .info-value {
            color: #555;
            margin-top: 3px;
        }
        
        .section {
            margin-bottom: 25px;
        }
        
        .section-title {
            background-color: #34495e;
            color: white;
            padding: 10px 15px;
            margin-bottom: 15px;
            font-weight: bold;
            font-size: 14px;
        }
        
        .section-content {
            padding: 0 15px;
            font-size: 12px;
        }
        
        .parties-grid {
            display: flex;
            gap: 30px;
            margin-bottom: 20px;
        }
        
        .party {
            flex: 1;
        }
        
        .party-title {
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 10px;
        }
        
        .party-info {
            background-color: #ecf0f1;
            padding: 10px;
            border-left: 3px solid #3498db;
            line-height: 1.8;
        }
        
        .vehicle-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        
        .vehicle-table th {
            background-color: #34495e;
            color: white;
            padding: 10px;
            text-align: left;
            font-size: 12px;
        }
        
        .vehicle-table td {
            padding: 10px;
            border-bottom: 1px solid #bdc3c7;
            font-size: 12px;
        }
        
        .vehicle-table tr:nth-child(even) {
            background-color: #ecf0f1;
        }
        
        .terms-list {
            list-style-type: none;
            padding: 0;
            margin: 0;
        }
        
        .terms-list li {
            padding: 8px 0;
            border-bottom: 1px solid #ecf0f1;
            font-size: 12px;
        }
        
        .terms-list strong {
            color: #2c3e50;
        }
        
        .signature-section {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #bdc3c7;
        }
        
        .signatures {
            display: flex;
            justify-content: space-between;
            gap: 40px;
        }
        
        .signature {
            flex: 1;
            text-align: center;
        }
        
        .signature-line {
            border-top: 1px solid #333;
            margin-top: 60px;
            margin-bottom: 5px;
        }
        
        .signature-label {
            font-size: 12px;
            font-weight: bold;
            color: #2c3e50;
        }
        
        .signature-date {
            font-size: 11px;
            color: #7f8c8d;
            margin-top: 15px;
        }
        
        .footer {
            text-align: center;
            margin-top: 50px;
            padding-top: 20px;
            border-top: 1px solid #bdc3c7;
            font-size: 10px;
            color: #95a5a6;
        }
        
        .alert-box {
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 12px;
            margin-bottom: 20px;
            font-size: 11px;
            color: #856404;
        }
        
        strong {
            color: #2c3e50;
        }
    </style>
</head>
<body>
    <!-- Header -->
    <div class="header">
        <h1>VEHICLE PURCHASE CONTRACT</h1>
        <p>Professional Vehicle Transaction Agreement</p>
        <p>Contract #: <strong>{{ $contractNumber }}</strong> | Date: <strong>{{ $contractDate }}</strong></p>
    </div>

    <!-- Contract Info -->
    <div class="contract-info">
        <div class="info-box">
            <div class="info-label">CONTRACT NUMBER:</div>
            <div class="info-value">{{ $contractNumber }}</div>
        </div>
        <div class="info-box">
            <div class="info-label">CONTRACT DATE:</div>
            <div class="info-value">{{ $contractDate }}</div>
        </div>
        <div class="info-box">
            <div class="info-label">TRANSACTION ID:</div>
            <div class="info-value">TXN-{{ str_pad($transaction->id, 6, '0', STR_PAD_LEFT) }}</div>
        </div>
    </div>

    <!-- Parties -->
    <div class="section">
        <div class="section-title">PARTIES TO THE AGREEMENT</div>
        <div class="section-content">
            <div class="parties-grid">
                <div class="party">
                    <div class="party-title">BUYER</div>
                    <div class="party-info">
                        <strong>Name:</strong> {{ $buyer->name }}<br>
                        <strong>Email:</strong> {{ $buyer->email }}<br>
                        <strong>Phone:</strong> {{ $buyer->phone ?? 'Not provided' }}<br>
                        <strong>Address:</strong> {{ $buyer->address ?? 'Not provided' }}<br>
                    </div>
                </div>
                <div class="party">
                    <div class="party-title">SELLER</div>
                    <div class="party-info">
                        <strong>Name:</strong> {{ $seller->name }}<br>
                        <strong>Email:</strong> {{ $seller->email }}<br>
                        <strong>Phone:</strong> {{ $seller->phone ?? 'Not provided' }}<br>
                        <strong>Address:</strong> {{ $seller->address ?? 'Not provided' }}<br>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Vehicle Details -->
    <div class="section">
        <div class="section-title">VEHICLE DETAILS</div>
        <div class="section-content">
            <table class="vehicle-table">
                <thead>
                    <tr>
                        <th>Property</th>
                        <th>Value</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>Make / Manufacturer</strong></td>
                        <td>{{ $vehicle->make }}</td>
                    </tr>
                    <tr>
                        <td><strong>Model</strong></td>
                        <td>{{ $vehicle->model }}</td>
                    </tr>
                    <tr>
                        <td><strong>Year</strong></td>
                        <td>{{ $vehicle->year }}</td>
                    </tr>
                    <tr>
                        <td><strong>VIN (Vehicle Identification Number)</strong></td>
                        <td>{{ $vehicle->vin ?? 'Not provided' }}</td>
                    </tr>
                    <tr>
                        <td><strong>License Plate</strong></td>
                        <td>{{ $vehicle->license_plate ?? 'Not provided' }}</td>
                    </tr>
                    <tr>
                        <td><strong>Mileage</strong></td>
                        <td>{{ $vehicle->mileage ? number_format($vehicle->mileage) . ' km' : 'Not provided' }}</td>
                    </tr>
                    <tr>
                        <td><strong>Color</strong></td>
                        <td>{{ $vehicle->color ?? 'Not provided' }}</td>
                    </tr>
                    <tr>
                        <td><strong>Condition</strong></td>
                        <td>{{ ucfirst($vehicle->condition ?? 'Not specified') }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <!-- Purchase Terms -->
    <div class="section">
        <div class="section-title">PURCHASE TERMS & CONDITIONS</div>
        <div class="section-content">
            <ul class="terms-list">
                <li>
                    <strong>Total Purchase Price:</strong>
                    {{ $formattedAmount }} {{ $currency }}
                </li>
                <li>
                    <strong>Payment Status:</strong>
                    Payment received and verified through secure escrow service
                </li>
                <li>
                    <strong>Delivery Status:</strong>
                    Vehicle prepared for delivery to buyer
                </li>
                <li>
                    <strong>Escrow Protection:</strong>
                    Funds held in secure escrow until vehicle delivery confirmation
                </li>
                <li>
                    <strong>Transaction Reference:</strong>
                    {{ $transaction->payment_reference }}
                </li>
                <li>
                    <strong>Contract Validity:</strong>
                    This contract becomes effective upon execution by both parties
                </li>
            </ul>
        </div>
    </div>

    <!-- Key Terms -->
    <div class="section">
        <div class="section-title">KEY TERMS & WARRANTIES</div>
        <div class="section-content">
            <ul class="terms-list">
                <li>
                    The seller warrants that they are the lawful owner of the vehicle and have the right to sell it.
                </li>
                <li>
                    The vehicle is sold in the condition observed by the buyer prior to purchase.
                </li>
                <li>
                    The buyer has inspected the vehicle and accepts it in its current condition.
                </li>
                <li>
                    Payment has been verified and secured through the AutoScout Safe Pay escrow service.
                </li>
                <li>
                    Both parties agree to complete all necessary documentation and transfer procedures.
                </li>
                <li>
                    This contract is governed by the terms of service of AutoScout Safe Pay platform.
                </li>
            </ul>
        </div>
    </div>

    <!-- Alert -->
    <div class="alert-box">
        <strong>Important Notice:</strong> This contract is a binding agreement between buyer and seller. Both parties acknowledge receipt of this contract and agree to its terms. Funds are held in secure escrow and will be released to the seller upon buyer's confirmation of vehicle delivery.
    </div>

    <!-- Signatures -->
    <div class="signature-section">
        <div class="section-title">SIGNATURES & ACCEPTANCE</div>
        <div class="section-content">
            <p>By signing below, both parties acknowledge that they have read, understood, and agree to the terms of this contract.</p>
            
            <div class="signatures">
                <div class="signature">
                    <p><strong>BUYER SIGNATURE</strong></p>
                    <div class="signature-line"></div>
                    <div class="signature-label">{{ $buyer->name }}</div>
                    <div class="signature-date">Date: ___________________</div>
                </div>
                
                <div class="signature">
                    <p><strong>SELLER SIGNATURE</strong></p>
                    <div class="signature-line"></div>
                    <div class="signature-label">{{ $seller->name }}</div>
                    <div class="signature-date">Date: ___________________</div>
                </div>
            </div>
        </div>
    </div>

    <!-- Footer -->
    <div class="footer">
        <p>This contract is automatically generated by AutoScout Safe Pay platform</p>
        <p>Document generated on {{ $contractDate }} | Contract #{{ $contractNumber }}</p>
        <p>For support, visit: <strong>support@scoutsafepay.com</strong></p>
    </div>
</body>
</html>
