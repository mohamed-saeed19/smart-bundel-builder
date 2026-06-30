import { Layout, notification, theme } from 'antd'
import { useCallback, useState } from 'react'
import { AppHeader } from './components/AppHeader'
import { BuilderSideRail } from './components/BuilderSideRail'
import { HeroSection } from './components/HeroSection'
import { PrintableInvoice } from './components/PrintableInvoice'
import { ProductCatalog } from './components/ProductCatalog'
import { useBundleBuilder } from './hooks/useBundleBuilder'

const { Content } = Layout

export default function App() {
  const { token } = theme.useToken()
  const [notificationApi, notificationContext] = notification.useNotification()
  const [liveMessage, setLiveMessage] = useState('')

  const notify = useCallback(
    (type: 'success' | 'info' | 'warning' | 'error', message: string) => {
      setLiveMessage(message)
      notificationApi[type]({
        title: message,
        placement: 'topRight',
        duration: 4,
        closable: true,
      })
    },
    [notificationApi],
  )

  const builder = useBundleBuilder(notify)

  return (
    <Layout
      style={{
        minHeight: '100vh',
        background: `radial-gradient(circle at top left, ${token.colorPrimaryBg}, transparent 34rem), radial-gradient(circle at bottom right, ${token.colorSuccessBg}, transparent 30rem), ${token.colorBgLayout}`,
      }}
    >
      {notificationContext}
      <AppHeader />

      <Content className="app-shell">
        <HeroSection />

        <div className="builder-layout">
          <ProductCatalog
            getDisabledState={builder.getDisabledState}
            groupedParts={builder.groupedParts}
            loading={builder.loading}
            onSelectPart={builder.selectPart}
            selections={builder.selections}
          />

          <BuilderSideRail
            budgetPercent={builder.budgetPercent}
            canRedo={builder.canRedo}
            canUndo={builder.canUndo}
            missingCategories={builder.missingCategories}
            onClear={builder.clearBuild}
            onExport={() => window.print()}
            onFinalize={builder.finalizeBuild}
            onLoadDraft={builder.restoreDraft}
            onRedo={builder.redo}
            onSaveDraft={builder.persistDraft}
            onUndo={builder.undo}
            remainingBudget={builder.remainingBudget}
            selectedParts={builder.selectedParts}
            totalCost={builder.totalCost}
          />
        </div>
      </Content>

      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {liveMessage}
      </div>

      <PrintableInvoice selectedParts={builder.selectedParts} totalCost={builder.totalCost} />
    </Layout>
  )
}
