declare namespace google {
  namespace accounts.id {
    function initialize(params: {
      client_id: string;
      callback: (response: any) => void;
    }): void;
    function renderButton(
      parent: HTMLElement,
      options: { theme: string; size: string }
    ): void;
  }
}
