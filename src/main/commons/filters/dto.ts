import { Catch, ExceptionFilter, DataValidationError } from 'electron-injector'

@Catch(DataValidationError)
export default class DtoFilter implements ExceptionFilter {
  catch(e: DataValidationError) {
    return { message: Object.values(e.Messages || {})[0] }
  }
}
