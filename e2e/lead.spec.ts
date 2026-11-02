import { execSync } from 'node:child_process'
import { expect, test } from '@playwright/test'

const RUN = Date.now()

function query(sql: string): string {
  return execSync(
    `docker exec aryahonda-mysql mysql -uroot -proot -N -B -e ${JSON.stringify(sql)} 2>/dev/null`,
  ).toString().trim()
}

const countNamed = (name: string) =>
  Number(query(`SELECT COUNT(*) FROM a1651tt5_hondaary.car_contact_form WHERE name='${name}';`))

test('submitting the offers form writes a lead to MySQL', async ({ page }) => {
  const name = `e2e-${RUN}-city`
  expect(countNamed(name)).toBe(0)

  await page.goto('/offers/honda-city/')
  await page.fill('input[name="name"]', name)
  await page.fill('input[name="mobile"]', '9876543210')
  await page.fill('input[name="email"]', 'e2e@example.com')
  await page.click('button[type="submit"]')

  await page.waitForURL('**/offers/honda-city/thank-you/**')
  await expect(page.locator('h1')).toContainText('Thank you')

  expect(countNamed(name)).toBe(1)
})

test('the stored lead carries the right model and source', async ({ page }) => {
  const name = `e2e-${RUN}-elevate`

  await page.goto('/offers/honda-elevate/')
  await page.fill('input[name="name"]', name)
  await page.fill('input[name="mobile"]', '9876543211')
  await page.fill('input[name="email"]', 'e2e2@example.com')
  await page.click('button[type="submit"]')
  await page.waitForURL('**/offers/honda-elevate/thank-you/**')

  const row = query(
    `SELECT model, source FROM a1651tt5_hondaary.car_contact_form WHERE name='${name}';`,
  )
  expect(row).toContain('Honda Elevate')
  expect(row).toContain('Adwords')
})

test('the model dropdown is what gets stored, including when changed', async ({ page }) => {
  const name = `e2e-${RUN}-select`

  // Landing page is City, but the visitor picks a different model.
  await page.goto('/offers/honda-city/')
  await expect(page.locator('select[name="model"]')).toHaveValue('Honda City')

  await page.fill('input[name="name"]', name)
  await page.fill('input[name="mobile"]', '9876543212')
  await page.fill('input[name="email"]', 'e2e3@example.com')
  await page.selectOption('select[name="model"]', 'Honda Elevate')
  await page.click('button[type="submit"]')
  await page.waitForURL('**/offers/honda-city/thank-you/**')

  const stored = query(
    `SELECT model FROM a1651tt5_hondaary.car_contact_form WHERE name='${name}';`,
  )
  expect(stored).toBe('Honda Elevate')
})

test('the lineup index form stores a lead and lands on the shared thank-you', async ({ page }) => {
  const name = `e2e-${RUN}-index`

  await page.goto('/offers/')
  // No model preselected here — the visitor must choose, as on the main site.
  await expect(page.locator('select[name="model"]')).toHaveValue('')

  await page.fill('input[name="name"]', name)
  await page.fill('input[name="mobile"]', '9876543213')
  await page.fill('input[name="email"]', 'e2e4@example.com')
  await page.selectOption('select[name="model"]', 'Honda ZR-V')
  await page.click('button[type="submit"]')

  await page.waitForURL('**/offers/thank-you/**')
  await expect(page.locator('h1')).toContainText('Thank you')

  const stored = query(
    `SELECT model, source FROM a1651tt5_hondaary.car_contact_form WHERE name='${name}';`,
  )
  expect(stored).toContain('Honda ZR-V')
  expect(stored).toContain('Adwords')
})
