// ユーザー登録
const { data, error } = await supabase.auth.signUp({
    email: 'exampl@email.com', // ここから変数処理を書く
    password: 'example-password',
});