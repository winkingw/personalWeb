interface ContactBody {
  name: string
  email: string
  subject: string
  message: string
  honeypot?: string
  startedAt?: number | string
}

const MIN_SUBMISSION_AGE_MS = 3000

function validate(body: ContactBody): string | null {
  if (!body.name?.trim()) return 'Name is required'
  if (!body.email?.trim()) return 'Email is required'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) return 'Invalid email address'
  if (!body.subject?.trim()) return 'Subject is required'
  if (!body.message?.trim()) return 'Message is required'
  if (body.message.trim().length < 10) return 'Message must be at least 10 characters'
  return null
}

function validateAntiSpam(body: ContactBody): string | null {
  if (body.honeypot?.trim()) return 'Spam submission rejected'

  const startedAt =
    typeof body.startedAt === 'number'
      ? body.startedAt
      : Number(String(body.startedAt || '').trim())

  if (!Number.isFinite(startedAt)) return 'Invalid submission timestamp'
  if (Date.now() - startedAt < MIN_SUBMISSION_AGE_MS) {
    return 'Please wait a moment before submitting'
  }

  return null
}

function getContactRecipient(): string {
  return (
    process.env.CONTACT_TO_EMAIL?.trim()
    || process.env.RESEND_TO_EMAIL?.trim()
    || ''
  )
}

export default defineEventHandler(async (event) => {
  const body = await readBody<ContactBody>(event).catch(() => null)

  if (!body) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid request body' })
  }

  const antiSpamError = validateAntiSpam(body)
  if (antiSpamError) {
    throw createError({ statusCode: 400, statusMessage: antiSpamError })
  }

  const validationError = validate(body)
  if (validationError) {
    throw createError({ statusCode: 422, statusMessage: validationError })
  }

  const resendApiKey = process.env.RESEND_API_KEY
  const contactRecipient = getContactRecipient()

  if (resendApiKey) {
    if (!contactRecipient) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Contact recipient email is not configured',
      })
    }

    try {
      const response = await $fetch<{ id?: string; error?: string }>(
        'https://api.resend.com/emails',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: {
            from: `Contact Form <onboarding@resend.dev>`,
            to: [contactRecipient],
            reply_to: body.email,
            subject: `[Contact] ${body.subject}`,
            html: `
              <h2>New Contact Form Submission</h2>
              <p><strong>Name:</strong> ${escapeHtml(body.name)}</p>
              <p><strong>Email:</strong> ${escapeHtml(body.email)}</p>
              <p><strong>Subject:</strong> ${escapeHtml(body.subject)}</p>
              <hr />
              <p>${escapeHtml(body.message).replace(/\n/g, '<br>')}</p>
            `,
          },
        }
      )

      if (response.id) {
        return { success: true }
      }

      console.error('Resend API error:', response)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to send email via Resend',
      })
    } catch (err: any) {
      if (err.statusCode) throw err
      console.error('Resend API call failed:', err)
      throw createError({
        statusCode: 500,
        statusMessage: 'Email service unavailable. Please try again later.',
      })
    }
  }

  // Dev fallback: log the message when no API key is configured
  console.log('--- Contact Form Submission (no RESEND_API_KEY) ---')
  console.log('Name:', body.name)
  console.log('Email:', body.email)
  console.log('To:', contactRecipient || '(not configured)')
  console.log('Subject:', body.subject)
  console.log('Message:', body.message)
  console.log('---------------------------------------------------')

  return { success: true }
})

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
