function Nav({ name }) {
    console.log(name);
  return (
    <div className="fixed top-0 w-full h-13 bg-[#ffbfe7] flex justify-between p-6 px-9 font-roboto text-[#a63b7d] font-custom z-10"
    style={{ boxShadow: '0 4px 10px rgba(167, 59, 125, 0.5)' }}>
      <a href="http://localhost:3000/landing">← Back</a>
      <h4 className="uppercase">{name}'s Skincare Fridge</h4>
      <a href="http://localhost:8000/logout">Logout →</a> 
    </div>
  );
}

export default Nav;
