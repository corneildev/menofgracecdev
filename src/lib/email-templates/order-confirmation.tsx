import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Row,
  Column,
} from '@react-email/components'
import * as React from 'react'

interface OrderItem {
  product_name: string
  quantity: number
  unit_price_fcfa: number
  size?: string
  product_image?: string
}

interface OrderConfirmationEmailProps {
  orderNumber: string
  customerName: string
  items: OrderItem[]
  totalFcfa: number
  shippingAddress: string
  shippingCity: string
}

export const OrderConfirmationEmail = ({
  orderNumber = 'MG-12345',
  customerName = 'Client',
  items = [],
  totalFcfa = 0,
  shippingAddress = '',
  shippingCity = '',
}: OrderConfirmationEmailProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA'
  }

  return (
    <Html>
      <Head />
      <Preview>Confirmation de votre commande {orderNumber} — Men of Grace</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={logo}>Men of Grace</Heading>
          </Section>
          
          <Section style={content}>
            <Heading style={h1}>Merci pour votre commande</Heading>
            <Text style={text}>
              Bonjour {customerName},
            </Text>
            <Text style={text}>
              Nous avons bien reçu votre commande <strong>#{orderNumber}</strong> et nous préparons déjà sa confection. 
              Un conseiller prendra contact avec vous sous peu pour valider les derniers détails.
            </Text>

            <Hr style={hr} />

            <Section>
              <Text style={heading}>DÉTAILS DE LA COMMANDE</Text>
              {items.map((item, index) => (
                <Row key={index} style={itemRow}>
                  <Column style={{ width: '64px' }}>
                    {item.product_image && (
                      <Img
                        src={item.product_image}
                        width="64"
                        height="85"
                        alt={item.product_name}
                        style={productImage}
                      />
                    )}
                  </Column>
                  <Column style={{ paddingLeft: '20px' }}>
                    <Text style={productName}>{item.product_name}</Text>
                    <Text style={productDetail}>Taille: {item.size || 'Sur-mesure'}</Text>
                    <Text style={productDetail}>Quantité: {item.quantity}</Text>
                  </Column>
                  <Column align="right">
                    <Text style={productPrice}>{formatPrice(item.unit_price_fcfa * item.quantity)}</Text>
                  </Column>
                </Row>
              ))}
            </Section>

            <Hr style={hr} />

            <Section style={totalSection}>
              <Row>
                <Column>
                  <Text style={totalLabel}>TOTAL</Text>
                </Column>
                <Column align="right">
                  <Text style={totalAmount}>{formatPrice(totalFcfa)}</Text>
                </Column>
              </Row>
            </Section>

            <Hr style={hr} />

            <Section>
              <Text style={heading}>LIVRAISON</Text>
              <Text style={text}>
                {shippingAddress}<br />
                {shippingCity}
              </Text>
            </Section>

            <Section style={footer}>
              <Text style={footerText}>
                Besoin d'aide ? Contactez notre conciergerie sur WhatsApp ou répondez à cet email.
              </Text>
              <Text style={footerText}>
                &copy; {new Date().getFullYear()} Men of Grace. Tous droits réservés.
              </Text>
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default OrderConfirmationEmail

const main = {
  backgroundColor: '#ffffff',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '40px 20px',
  width: '600px',
}

const header = {
  padding: '30px 0',
  textAlign: 'center' as const,
}

const logo = {
  fontFamily: 'serif',
  fontSize: '28px',
  fontStyle: 'italic',
  margin: '0',
  color: '#000000',
  letterSpacing: '-0.02em',
}

const content = {
  padding: '20px 0',
}

const h1 = {
  fontSize: '24px',
  fontWeight: '300',
  textAlign: 'center' as const,
  margin: '30px 0',
  color: '#000000',
  letterSpacing: '0.05em',
  textTransform: 'uppercase' as const,
}

const text = {
  fontSize: '14px',
  lineHeight: '24px',
  color: '#444444',
}

const heading = {
  fontSize: '11px',
  letterSpacing: '0.2em',
  fontWeight: '600',
  color: '#888888',
  marginBottom: '20px',
}

const itemRow = {
  marginBottom: '20px',
}

const productImage = {
  borderRadius: '2px',
  objectFit: 'cover' as const,
}

const productName = {
  fontSize: '14px',
  fontWeight: '600',
  margin: '0 0 5px 0',
  color: '#000000',
}

const productDetail = {
  fontSize: '12px',
  color: '#888888',
  margin: '0',
}

const productPrice = {
  fontSize: '14px',
  fontWeight: '600',
  color: '#000000',
}

const totalSection = {
  padding: '10px 0',
}

const totalLabel = {
  fontSize: '14px',
  fontWeight: '600',
  color: '#000000',
}

const totalAmount = {
  fontSize: '18px',
  fontWeight: '600',
  color: '#000000',
}

const hr = {
  borderColor: '#eeeeee',
  margin: '30px 0',
}

const footer = {
  textAlign: 'center' as const,
  marginTop: '40px',
}

const footerText = {
  fontSize: '12px',
  color: '#aaaaaa',
  lineHeight: '20px',
}
