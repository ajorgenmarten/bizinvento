import { Controller, OnSend } from 'electron-injector'

@Controller()
export default class AppController {
  @OnSend('ping')
  ping(): void {
    console.log('Application respond with: pong')
  }
}
