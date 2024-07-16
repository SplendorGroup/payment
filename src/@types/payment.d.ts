declare namespace Payment {
  interface Request {
    transaction_amount: number;
    token: string;
    description: string;
    installments: number;
    payment_method_id: string;
    issuer_id: number;
    payer: {
      email: string;
      identification: {
        type: string;
        number: string;
      };
    };
  }

  interface ProcessRequest {
    transactionAmount: number;
    token: string;
    description: string;
    email: string;
    payerFirstName: string;
    payerLastName: string;
    identificationType: string;
    identificationNumber: string;
  }

  export interface ProcessCardRequest {
    token: string
    issuer_id: string
    payment_method_id: string
    transaction_amount: number
    description: string;
    installments: number
    payer: Payer
    idempotent_key: string
  }
  
  export interface Payer {
    email: string
    identification: Identification
  }
  
  export interface Identification {
    type: string
    number: string
  }

  interface ProcessResponse {
    id: number;
    date_created: string;
    date_approved: string | null;
    date_last_updated: string;
    date_of_expiration: string;
    money_release_date: string | null;
    money_release_status: string;
    operation_type: string;
    issuer_id: string;
    payment_method_id: string;
    payment_type_id: string;
    payment_method: {
      id: string;
      type: string;
      issuer_id: string;
    };
    status: string;
    status_detail: string;
    currency_id: string;
    description: string;
    live_mode: boolean;
    sponsor_id: null;
    authorization_code: null;
    money_release_schema: null;
    taxes_amount: number;
    counter_currency: null;
    brand_id: null;
    shipping_amount: number;
    build_version: string;
    pos_id: null;
    store_id: null;
    integrator_id: null;
    platform_id: null;
    corporation_id: null;
    payer: {
      identification: {
        number: string;
        type: string;
      };
      entity_type: null;
      phone: {
        number: null;
        extension: null;
        area_code: null;
      };
      last_name: null;
      id: string;
      type: null;
      first_name: null;
      email: string;
    };
    collector_id: number;
    marketplace_owner: null;
    metadata: Record<string, any>;
    additional_info: {
      available_balance: null;
      nsu_processadora: null;
      authentication_code: null;
    };
    order: Record<string, any>;
    external_reference: null;
    transaction_amount: number;
    transaction_amount_refunded: number;
    coupon_amount: number;
    differential_pricing_id: null;
    financing_group: null;
    deduction_schema: null;
    callback_url: null;
    installments: number;
    transaction_details: {
      payment_method_reference_id: null;
      acquirer_reference: null;
      net_received_amount: number;
      total_paid_amount: number;
      overpaid_amount: number;
      external_resource_url: null;
      installment_amount: number;
      financial_institution: null;
      payable_deferral_period: null;
      bank_transfer_id: null;
      transaction_id: null;
    };
    fee_details: Record<string, any>[]; // Assuming it's an array of objects
    charges_details: [
      {
        id: string;
        name: string;
        type: string;
        accounts: {
          from: string;
          to: string;
        };
        client_id: number;
        date_created: string;
        last_updated: string;
        amounts: {
          original: number;
          refunded: number;
        };
        metadata: Record<string, any>;
        reserve_id: null;
        refund_charges: Record<string, any>[];
      },
    ];
    captured: boolean;
    binary_mode: boolean;
    call_for_authorize_id: null;
    statement_descriptor: null;
    card: Record<string, any>;
    notification_url: null;
    refunds: Record<string, any>[];
    processing_mode: string;
    merchant_account_id: null;
    merchant_number: null;
    acquirer_reconciliation: Record<string, any>[];
    point_of_interaction: {
      type: string;
      business_info: {
        unit: string;
        sub_unit: string;
        branch: null;
      };
      location: {
        state_id: null;
        source: null;
      };
      application_data: {
        name: null;
        version: null;
      };
      transaction_data: {
        qr_code: string;
        bank_transfer_id: null;
        transaction_id: null;
        e2e_id: null;
        financial_institution: null;
        ticket_url: string;
        bank_info: {
          payer: {
            account_id: null;
            id: null;
            long_name: null;
            account_holder_name: null;
            identification: {
              number: null;
              type: null;
            };
            external_account_id: null;
          };
          collector: {
            account_id: null;
            long_name: null;
            account_holder_name: string;
            transfer_account_id: null;
          };
          is_same_bank_account_owner: null;
          origin_bank_id: null;
          origin_wallet_id: null;
        };
        infringement_notification: {
          type: null;
          status: null;
        };
        qr_code_base64: string;
      };
    };
    accounts_info: null;
    tags: null;
    api_response: {
      status: number;
      headers: {
        date: string[];
        content_type: string[];
        transfer_encoding: string[];
        connection: string[];
        vary: string[];
        x_site_id: string[];
        cache_control: string[];
        x_content_type_options: string[];
        x_request_id: string[];
        x_xss_protection: string[];
        strict_transport_security: string[];
        access_control_allow_origin: string[];
        access_control_allow_headers: string[];
        access_control_allow_methods: string[];
        access_control_max_age: string[];
        timing_allow_origin: string[];
        content_encoding: string[];
      };
    };
  }
}
