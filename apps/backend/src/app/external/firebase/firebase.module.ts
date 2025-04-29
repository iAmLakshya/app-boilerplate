import { DynamicModule, Global, Module } from '@nestjs/common';
import { FirebaseAuthProvider } from './firebase-auth.provider';
import { FirebaseService } from './firebase.service';

@Global()
@Module({})
export class FirebaseModule {
  static register(): DynamicModule {
    return {
      module: FirebaseModule,
      providers: [FirebaseService, FirebaseAuthProvider],
      exports: [FirebaseService, FirebaseAuthProvider],
    };
  }
}
