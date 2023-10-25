using Domain.Common;

namespace Domain.Models.Login {
    public class ReqLogin {
        public string login { get; set; }
        public string password { get; set; }
        public int id_sistema { get; set; } = 0;
        public string terminal { get; set; } = String.Empty;

        public ReqLogin getTramasQuemadas() {
            this.login = "smmichay";
            this.password = "4a8a08f09d37b73795649038408b5f33"; // c - md5
            return this;
        }
    }
}
