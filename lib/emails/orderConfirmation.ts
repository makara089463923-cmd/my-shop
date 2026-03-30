interface OrderItem {
  name: string
  quantity: number
  price: number
}

interface OrderData {
  id: string
  customerName: string
  customerEmail: string
  total: number
  items: OrderItem[]
  createdAt: Date
}

export function getOrderConfirmationEmail(order: OrderData): string {
  const itemsHtml = order.items.map(item => `
    <tr style="border-bottom: 1px solid #e5e7eb;">
      <td style="padding: 12px 0;">${item.name}</td>
      <td style="padding: 12px 0; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px 0; text-align: right;">$${item.price.toFixed(2)}</td>
      <td style="padding: 12px 0; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
    </tr>
  `).join('')

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>ការបញ្ជាទិញជោគជ័យ</title>
    </head>
    <body style="font-family: 'Khmer OS', 'Noto Sans Khmer', Arial, sans-serif; background-color: #f9fafb; margin: 0; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 
6px rgba(0,0,0,0.1);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #ec489a, #f43f5e); padding: 30px 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">🌸 អរគុណសម្រាប់ការបញ្ជាទិញ!</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0;">លេខបញ្ជាទិញ: #${order.id.slice(-8)}</p>
        </div>

        <!-- Content -->
        <div style="padding: 30px 20px;">
          <p style="color: #374151; margin-bottom: 20px;">សួស្តី <strong>${order.customerName}</strong>,</p>
          <p style="color: #374151; margin-bottom: 20px;">ការបញ្ជាទិញរបស់អ្នកត្រូវបានទទួលជោគជ័យ។ យើងនឹងរៀបចំផ្ការបស់អ្នកឆាប់ៗនេះ!</p>

          <!-- Order Items -->
          <div style="background-color: #f9fafb; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
            <h3 style="color: #ec489a; margin: 0 0 15px;">📋 ព័ត៌មានលម្អិត</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="border-bottom: 2px solid #e5e7eb;">
                  <th style="text-align: left; padding-bottom: 8px;">ផលិតផល</th>
                  <th style="text-align: center; padding-bottom: 8px;">ចំនួន</th>
                  <th style="text-align: right; padding-bottom: 8px;">តម្លៃ/ដើម</th>
                  <th style="text-align: right; padding-bottom: 8px;">សរុប</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
              <tfoot>
                <tr style="border-top: 2px solid #e5e7eb;">
                  <td colspan="3" style="padding: 12px 0; text-align: right; font-weight: bold;">សរុបទាំងអស់</td>
                  <td style="padding: 12px 0; text-align: right; font-weight: bold; color: #ec489a;">$${order.total.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <!-- Status -->
          <div style="background-color: #fef3c7; border-radius: 12px; padding: 15px; margin-bottom: 20px;">
            <p style="color: #d97706; margin: 0; font-size: 14px;">
              ⏳ ស្ថានភាពបច្ចុប្បន្ន: <strong>កំពុងរង់ចាំ</strong><br>
              យើងនឹងជូនដំណឹងអ្នកនៅពេលផ្កាត្រូវបានដឹកជញ្ជូន។
            </p>
          </div>

          <!-- Footer -->
          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center;">
            <p style="color: #6b7280; font-size: 12px; margin: 0;">🌸 សូមអរគុណដែលទុកចិត្តយើង</p>
            <p style="color: #6b7280; font-size: 12px; margin: 5px 0 0;">ប្រសិនបើមានសំណួរ សូមទំនាក់ទំនងមកយើងខ្ញុំ</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `
}
