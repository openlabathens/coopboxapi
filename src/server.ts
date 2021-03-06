import 'dotenv/config';
import App from './app';
import AuthenticationController from './authentication/authentication.controller';
import PostController from './post/post.controller';
import CoopboxController from './coopbox/coopbox.controller';
import TransactionController from './transaction/transaction.controller';
import UserController from './user/user.controller';
import validateEnv from './utils/validateEnv';

validateEnv();

const app = new App(
  [
    new PostController(),
    new AuthenticationController(),
    new UserController(),
    new TransactionController(),
    new CoopboxController(),
  ],
);

app.listen();
