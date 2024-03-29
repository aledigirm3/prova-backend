const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const { ObjectId } = mongoose.Schema;
const jwt = require("jsonwebtoken");
const UserSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Campo obbligatorio"],
      maxlength: 32,
    },
    email: {
      type: String,
      trim: true,
      required: [true, "Campo obbligatorio"],
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        `Perfavore inserisci un' email valida`,
      ], //validazione
    },

    password: {
      type: String,
      trim: true,
      minlength: [6, "troppo corta"],
      required: [true, "Campo obbligatorio"],
      match: [
        /^(?=.*\d)(?=.*[@#\-_$%^&+=§!?])(?=.*[a-z])(?=.*[A-Z])[0-9A-Za-z@#\-_$%^&+=§!?]+$/,
        `deve contenere almeno 1 maiuscola, una minuscola, un numero e un carattere speciale`,
      ], //validazione
    },

    carrello: {
      type: ObjectId,
      ref: "Cart",
    },

    role: {
      type: Number,
      default: -1,
    },
  },
  { timestamps: true }
); //dettagli sugli orari (creazione e modifiche)

//cripta la password prima di salvare
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

//genera un token contenente l'id utente (scade dopo 1 ora)

//collection database con token jwt e ref utente corrispondente

UserSchema.methods.jwtGenerateToken = function () {
  return jwt.sign({ id: this.id }, process.env.JWT_SECRET, { expiresIn: 3600 });
};
UserSchema.methods.jwtGenerateTokenBreve = function () {
  return jwt.sign({ id: this.id }, process.env.JWT_SECRET, { expiresIn: 500 });
};
//compara la password direttamente nel modello al fine di ottimizzare il processo
/* UserSchema.methods.comparePassword = async function(yourPassword){
  return await bcrypt.compare(yourPassword, this.password)
}
 */
const UserModel = mongoose.model("User", UserSchema, "users");

module.exports = { UserSchema, UserModel };
