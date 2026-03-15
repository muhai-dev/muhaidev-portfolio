# muhaidev-portfolio

Portfolio website built with React and Vite.

## Project Structure

```text
port-folio/
├── src/                # React frontend
├── public/             # Static assets
└── ...
```

## Environment Variables

Never commit your real `.env` file. Use `.env.example` as the template.

For EmailJS in Vite, create a root `.env` file:

```bash
cp .env.example .env
```

Then set:

```env
VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id
VITE_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
```

## Setup

```bash
npm install
npm run dev
```

## Contact Form

The contact form sends messages directly from the frontend using `@emailjs/browser`.

EmailJS template variables used by the form:

- `from_name`
- `from_email`
- `reply_to`
- `message`
- `to_email`
