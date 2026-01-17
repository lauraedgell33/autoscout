import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Purchase Agreement | AutoScout24 SafeTrade',
  description: 'Standard purchase agreement terms for vehicle transactions',
}

export default function PurchaseAgreement() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-orange-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <a href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-900 to-orange-500 rounded-lg"></div>
              <span className="text-xl font-bold text-blue-900">AutoScout24 SafeTrade</span>
            </a>
            <a href="/" className="text-sm text-gray-600 hover:text-blue-900">
              Back to Home
            </a>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-blue-900 mb-4">Purchase Agreement</h1>
        <p className="text-gray-600 mb-8">Standard Vehicle Purchase Agreement Template</p>

        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          {/* Introduction */}
          <div className="p-6 bg-blue-50 rounded-lg border-l-4 border-blue-900">
            <p className="text-gray-700">
              This Purchase Agreement is automatically generated for each transaction on AutoScout24 SafeTrade. It constitutes a legally binding contract between the Buyer and Seller, with AutoScout24 SafeTrade acting as the escrow agent and facilitator.
            </p>
          </div>

          {/* Agreement Header */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">VEHICLE PURCHASE AGREEMENT</h2>
            <p className="text-gray-700 mb-4">
              This Vehicle Purchase Agreement ("Agreement") is entered into on the date of payment initiation ("Effective Date") by and between:
            </p>
            <div className="grid grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-2">SELLER</p>
                <p className="text-gray-700">[Seller Name]</p>
                <p className="text-gray-700 text-sm">[Seller Address]</p>
                <p className="text-gray-700 text-sm">[Seller Email]</p>
                <p className="text-gray-700 text-sm">[Seller Phone]</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-2">BUYER</p>
                <p className="text-gray-700">[Buyer Name]</p>
                <p className="text-gray-700 text-sm">[Buyer Address]</p>
                <p className="text-gray-700 text-sm">[Buyer Email]</p>
                <p className="text-gray-700 text-sm">[Buyer Phone]</p>
              </div>
            </div>
          </section>

          {/* 1. Vehicle Description */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">1. Vehicle Description</h2>
            <p className="text-gray-700 mb-4">
              The Seller agrees to sell and the Buyer agrees to purchase the following vehicle ("Vehicle"):
            </p>
            <div className="p-4 bg-gray-50 rounded-lg space-y-2 text-gray-700">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Make:</p>
                  <p className="font-semibold">[Vehicle Make]</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Model:</p>
                  <p className="font-semibold">[Vehicle Model]</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Year:</p>
                  <p className="font-semibold">[Year]</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">VIN:</p>
                  <p className="font-semibold">[VIN Number]</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Mileage:</p>
                  <p className="font-semibold">[Mileage] km</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Color:</p>
                  <p className="font-semibold">[Color]</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Fuel Type:</p>
                  <p className="font-semibold">[Fuel Type]</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Transmission:</p>
                  <p className="font-semibold">[Transmission]</p>
                </div>
              </div>
            </div>
          </section>

          {/* 2. Purchase Price */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">2. Purchase Price and Payment</h2>
            <div className="p-4 bg-gray-50 rounded-lg space-y-3">
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-700">Vehicle Price:</span>
                <span className="font-semibold text-gray-900">[Amount] EUR</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-700">Buyer Service Fee (2.5%):</span>
                <span className="font-semibold text-gray-900">[Fee] EUR</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-700">Seller Service Fee (1.5%):</span>
                <span className="font-semibold text-gray-900">[Fee] EUR</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-lg font-bold text-blue-900">Total Payment by Buyer:</span>
                <span className="text-lg font-bold text-blue-900">[Total] EUR</span>
              </div>
              <div className="flex justify-between">
                <span className="text-lg font-bold text-orange-600">Amount to Seller:</span>
                <span className="text-lg font-bold text-orange-600">[Net Amount] EUR</span>
              </div>
            </div>
          </section>

          {/* 3. Payment Terms */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">3. Payment Terms</h2>
            <p className="text-gray-700 mb-4">
              <strong>3.1 Escrow Service:</strong> Payment shall be made via bank transfer to the AutoScout24 SafeTrade escrow account.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>3.2 Fund Holding:</strong> Funds will be held in escrow until the Buyer completes vehicle inspection and provides formal acceptance.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>3.3 Fund Release:</strong> Upon Buyer acceptance, funds will be released to Seller within 2 business days, minus applicable service fees.
            </p>
            <p className="text-gray-700">
              <strong>3.4 Refund Conditions:</strong> If Buyer rejects the Vehicle for valid reasons as outlined in the Refund Policy, a full refund will be processed.
            </p>
          </section>

          {/* 4. Seller Representations */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">4. Seller Representations and Warranties</h2>
            <p className="text-gray-700 mb-4">
              The Seller represents and warrants that:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>The Seller has legal title to the Vehicle and right to sell it</li>
              <li>The Vehicle is free from liens, encumbrances, or legal claims</li>
              <li>All information provided in the listing is accurate and truthful</li>
              <li>The Vehicle has not been reported stolen or salvaged</li>
              <li>The mileage stated is accurate to the best of Seller's knowledge</li>
              <li>All known defects and issues have been disclosed</li>
              <li>The Vehicle will be delivered in the condition described</li>
              <li>All necessary documentation for transfer will be provided</li>
            </ul>
          </section>

          {/* 5. Buyer Obligations */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">5. Buyer Obligations</h2>
            <p className="text-gray-700 mb-4">
              The Buyer agrees to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Complete payment as specified in this Agreement</li>
              <li>Inspect the Vehicle within 7 business days of payment</li>
              <li>Provide formal acceptance or rejection within the inspection period</li>
              <li>Arrange vehicle pickup or delivery within 14 days of acceptance</li>
              <li>Complete all registration and transfer procedures</li>
              <li>Obtain appropriate insurance coverage</li>
              <li>Pay all applicable taxes and registration fees</li>
            </ul>
          </section>

          {/* 6. Inspection Period */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">6. Inspection Period</h2>
            <p className="text-gray-700 mb-4">
              <strong>6.1 Duration:</strong> Buyer has 7 business days from payment date to inspect the Vehicle.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>6.2 Location:</strong> Inspection shall take place at [Inspection Location] or as mutually agreed.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>6.3 Professional Inspection:</strong> Buyer may hire an independent mechanic for professional inspection at Buyer's expense.
            </p>
            <p className="text-gray-700">
              <strong>6.4 Test Drive:</strong> Buyer is permitted a reasonable test drive under Seller supervision.
            </p>
          </section>

          {/* 7. Acceptance or Rejection */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">7. Acceptance or Rejection</h2>
            <p className="text-gray-700 mb-4">
              <strong>7.1 Formal Acceptance:</strong> Buyer must formally accept the Vehicle through the platform within the inspection period.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>7.2 Rejection:</strong> If the Vehicle does not match the description or has undisclosed issues, Buyer may reject it and receive a full refund.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>7.3 Deemed Acceptance:</strong> Failure to respond within the inspection period constitutes acceptance.
            </p>
            <p className="text-gray-700">
              <strong>7.4 Final Sale:</strong> Upon acceptance, the sale is final (subject to Refund Policy conditions).
            </p>
          </section>

          {/* 8. Transfer of Ownership */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">8. Transfer of Ownership</h2>
            <p className="text-gray-700 mb-4">
              <strong>8.1 Documentation:</strong> Seller shall provide:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
              <li>Original vehicle registration certificate</li>
              <li>Certificate of roadworthiness (ITP/MOT)</li>
              <li>Service and maintenance records</li>
              <li>Owner's manual and spare keys</li>
              <li>Bill of sale signed by both parties</li>
            </ul>
            <p className="text-gray-700 mt-4 mb-4">
              <strong>8.2 Transfer Process:</strong> Both parties shall complete all necessary paperwork to legally transfer ownership.
            </p>
            <p className="text-gray-700">
              <strong>8.3 Liability Transfer:</strong> Risk of loss and liability transfers to Buyer upon acceptance and vehicle delivery.
            </p>
          </section>

          {/* 9. Vehicle Delivery */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">9. Vehicle Delivery</h2>
            <p className="text-gray-700 mb-4">
              <strong>9.1 Delivery Date:</strong> Vehicle shall be delivered within 14 days of acceptance.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>9.2 Delivery Method:</strong> [Buyer Pickup / Seller Delivery / Third-Party Transport]
            </p>
            <p className="text-gray-700 mb-4">
              <strong>9.3 Delivery Location:</strong> [Delivery Address]
            </p>
            <p className="text-gray-700">
              <strong>9.4 Transport Costs:</strong> [To be paid by Buyer / Seller / Shared]
            </p>
          </section>

          {/* 10. "As-Is" Sale */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">10. "As-Is" Condition</h2>
            <p className="text-gray-700 mb-4">
              <strong>10.1 Sale Condition:</strong> The Vehicle is sold "AS-IS, WHERE-IS" with all faults, except as specifically disclosed.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>10.2 No Warranty:</strong> Seller provides no warranty beyond the representations in Section 4.
            </p>
            <p className="text-gray-700">
              <strong>10.3 Buyer Responsibility:</strong> Buyer accepts full responsibility for the Vehicle's condition after acceptance.
            </p>
          </section>

          {/* 11. Cancellation */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">11. Cancellation</h2>
            <p className="text-gray-700 mb-4">
              <strong>11.1 Buyer Cancellation:</strong> Buyer may cancel before inspection with forfeiture of service fees.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>11.2 Seller Cancellation:</strong> If Seller cancels after payment, Buyer receives full refund plus €100 compensation, and Seller pays penalty fee.
            </p>
            <p className="text-gray-700">
              <strong>11.3 Mutual Cancellation:</strong> Both parties may agree to cancel with terms to be negotiated.
            </p>
          </section>

          {/* 12. Dispute Resolution */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">12. Dispute Resolution</h2>
            <p className="text-gray-700 mb-4">
              <strong>12.1 Mediation:</strong> Any disputes shall first be submitted to AutoScout24 SafeTrade's dispute resolution system.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>12.2 Arbitration:</strong> If mediation fails, disputes shall be resolved through binding arbitration.
            </p>
            <p className="text-gray-700">
              <strong>12.3 Governing Law:</strong> This Agreement is governed by Romanian and EU law.
            </p>
          </section>

          {/* 13. Platform Role */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">13. AutoScout24 SafeTrade's Role</h2>
            <p className="text-gray-700 mb-4">
              <strong>13.1 Facilitator:</strong> AutoScout24 SafeTrade acts as a marketplace facilitator and escrow agent only.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>13.2 Not a Party:</strong> AutoScout24 SafeTrade is not a party to this sale and makes no warranties about the Vehicle.
            </p>
            <p className="text-gray-700">
              <strong>13.3 Dispute Mediation:</strong> AutoScout24 SafeTrade will provide mediation services as outlined in the Terms of Service.
            </p>
          </section>

          {/* 14. Additional Terms */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">14. Additional Terms</h2>
            <p className="text-gray-700 mb-4">
              <strong>14.1 Entire Agreement:</strong> This Agreement, together with the platform Terms of Service, constitutes the entire agreement.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>14.2 Amendments:</strong> Any modifications must be in writing and agreed by both parties.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>14.3 Severability:</strong> If any provision is invalid, the remainder shall remain in effect.
            </p>
            <p className="text-gray-700">
              <strong>14.4 Assignment:</strong> This Agreement may not be assigned without written consent of both parties.
            </p>
          </section>

          {/* Signatures */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">15. Electronic Signatures</h2>
            <p className="text-gray-700 mb-6">
              By clicking "Accept and Pay" on the AutoScout24 SafeTrade platform, both Buyer and Seller electronically sign this Agreement and acknowledge that they have read, understood, and agree to all terms.
            </p>
            
            <div className="grid grid-cols-2 gap-8 p-6 bg-gray-50 rounded-lg">
              <div className="space-y-4">
                <p className="font-semibold text-gray-900">SELLER SIGNATURE</p>
                <div className="border-t-2 border-gray-300 pt-2">
                  <p className="text-gray-700">[Electronic Signature]</p>
                  <p className="text-sm text-gray-600">Name: [Seller Name]</p>
                  <p className="text-sm text-gray-600">Date: [Signature Date]</p>
                  <p className="text-sm text-gray-600">IP: [IP Address]</p>
                </div>
              </div>
              <div className="space-y-4">
                <p className="font-semibold text-gray-900">BUYER SIGNATURE</p>
                <div className="border-t-2 border-gray-300 pt-2">
                  <p className="text-gray-700">[Electronic Signature]</p>
                  <p className="text-sm text-gray-600">Name: [Buyer Name]</p>
                  <p className="text-sm text-gray-600">Date: [Signature Date]</p>
                  <p className="text-sm text-gray-600">IP: [IP Address]</p>
                </div>
              </div>
            </div>
          </section>

          {/* Important Notice */}
          <div className="mt-8 p-6 bg-orange-50 rounded-lg border-l-4 border-orange-500">
            <p className="text-gray-700 font-semibold mb-2">
              ⚠️ Legal Binding Agreement
            </p>
            <p className="text-gray-700">
              This is a legally binding contract. Both parties should review all terms carefully before proceeding. If you have questions, consult with a legal professional. Electronic signatures carry the same legal weight as handwritten signatures under EU eIDAS Regulation.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-blue-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center">
            <div className="text-sm text-blue-300">
              © 2026 AutoScout24 SafeTrade. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="/legal/terms" className="text-blue-300 hover:text-white">Terms of Service</a>
              <a href="/legal/privacy" className="text-blue-300 hover:text-white">Privacy Policy</a>
              <a href="/legal/refund" className="text-blue-300 hover:text-white">Refund Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
