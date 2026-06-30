import { Typography, theme } from 'antd'

const { Title, Paragraph, Text } = Typography

export function HeroSection() {
  const { token } = theme.useToken()

  return (
    <section
      className="intro-band"
      style={{
        background: `linear-gradient(135deg, ${token.colorPrimaryBg}, ${token.colorSuccessBg}), ${token.colorBgContainer}`,
        borderColor: token.colorBorderSecondary,
        boxShadow: token.boxShadowTertiary,
      }}
    >
      <div>
        <Text className="eyebrow">Custom tech shop</Text>
        <Title level={1}>Build a compatible setup under $1,000</Title>
        <Paragraph>
          Pick one component per category. The builder blocks over-budget choices and incompatible
          hardware before they enter your cart.
        </Paragraph>
      </div>
    </section>
  )
}
