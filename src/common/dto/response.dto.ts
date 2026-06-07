export class ResponseDto<T> {
  success!: boolean;
  message!: string;
  data?: T;

  static success<T>(
    data: T,
    message = 'Operação realizada com sucesso',
  ): ResponseDto<T> {
    return { success: true, message, data };
  }

  static error(message: string): ResponseDto<null> {
    return { success: false, message };
  }
}
