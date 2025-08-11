export const createCookie = (res, token, id)=>{
    res.cookie(token, id, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 20 * 60 * 1000
    });
}