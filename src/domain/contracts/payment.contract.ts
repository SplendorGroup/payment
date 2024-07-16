export interface PaymentContract {
  getTransaction(id: any): Promise<unknown>;
  process(body: Payment.ProcessRequest): Promise<unknown>;
  processCard(body: Payment.ProcessCardRequest): Promise<unknown>;
}
