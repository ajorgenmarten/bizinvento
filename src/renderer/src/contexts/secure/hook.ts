import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

type ReturnType = {
  qrPayload: string
  status: 'active' | 'expired'
  activeLicense: (key: string) => Promise<boolean>
}

export default function useSecureHook(): ReturnType {
  const [qrPayload, setQrPayload] = useState<string>('')
  const [status, setStatus] = useState<ReturnType['status']>('expired')

  const getStatus = useCallback(async (): Promise<ReturnType['status']> => {
    const status = await window.electron.ipcRenderer.invoke('secure:status')
    return status as ReturnType['status']
  }, [])

  const ping = useCallback(async (): Promise<ReturnType['status']> => {
    const response = await window.electron.ipcRenderer.invoke('secure:ping')
    setStatus(response)
    return response
  }, [])

  const activeLicense = useCallback(async (key: string): Promise<boolean> => {
    const response = await window.electron.ipcRenderer.invoke('secure:active', { key })
    if (response) setStatus('active')
    return response
  }, [])

  const getQrPayload = async (): Promise<string> => {
    const payload = await window.electron.ipcRenderer.invoke('secure:get-qr-payload')
    return (payload as string) || ''
  }

  const expirationWarn = useCallback(async (): Promise<void> => {
    const payload = await window.electron.ipcRenderer.invoke('secure:expiration-warning')
    if (payload) toast.warn('Su licencia está a punto de vencerse')
  }, [])

  useEffect(() => {
    getStatus()
      .then((res) => setStatus(res))
      .then(getQrPayload)
      .then((res) => setQrPayload(res))
      .then(expirationWarn)
    const interval = setInterval(ping, 120000)
    return () => clearInterval(interval)
  }, [])

  return { qrPayload, status, activeLicense }
}
