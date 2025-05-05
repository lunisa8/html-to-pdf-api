const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

app.post('/convert', async (req, res) => {
  const html = req.body.html;

  if (!html) {
    return res.status(400).send('NO HTML received');
  }

  try {
    const browser = await puppeteer.launch({
      headless: "new",
      args: ['--no-sandbox']
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({ format: 'A4' });
    await browser.close();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="documento.pdf"',
    });

    res.send(pdfBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error generating PDF');
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});

