import {Module,VuexModule,Mutation,Action,getModule,} from 'vuex-module-decorators';
import store from '@/store';

type User = { username: string; password: string; }

// dynamic: true: 动态创建动态模块,即new Vuex.Store({})里面不用注册的.空着就行,
// store,当前模块注册到store上.也可以写在getModule上,即getModule(PassengerStore,store)
// namespaced: true, name: 'passenger' 命名空间
@Module({
  name: 'passenger', dynamic: true, namespaced: true, store,
})
export default class PassengerStore extends VuexModule {
  // state => 要public不然外面调用不到
  public loginInfo: User[] = [];

  // getter
  get userNumber(): number {
    return this.loginInfo.length;
  }

  @Mutation
  USERINFO(user: User): void {
    console.log(user);
    this.loginInfo.push(user);
  }
  // commit的两种调用方式,第一种,Action后面的括号里面添加commit,然后return的结果就是USERINFO的参数
  @Action({ commit: 'USERINFO' })
  getZhangsan(): User {
    return { username: '张三', password: 'zhangsan' };
  }
  // 第二种,直接this.USERINFO调用;
  @Action
  getLisi(): void {
    const user = { username: '李四', password: 'lisi' };
    this.context.commit('USERINFO', user); // commit调用
    // this.USERINFO(user); // 直接调用
  }
}
// 使用getModule: 对类型安全的访问
export const PassengerStoreModule = getModule(PassengerStore);
