const SUPABASE_URL = "https://tweshttzxtaicdmlbjke.supabase.co";
const SUPABASE_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3ZXNodHR6eHRhaWNkbWxiamtlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4OTM5MjYsImV4cCI6MjA3MTQ2OTkyNn0.ePjrPiKyFqXL2YbWpTKznDJ5ri-eVyYdgNzeZ4m9Bwo";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_API_KEY);
//console.log(supabase);



const userFeed = document.getElementById("user-feed");
const postBtn = document.getElementById("addPost");
const userInput = document.getElementById("userinput");
const signUpBtn = document.getElementById("signup");
const loginBtn = document.getElementById("login");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password")


signUpBtn.addEventListener("click", async () => {

    const { data, error } = await supabase.auth.signUp({
        email: emailInput.value,
        password: passwordInput.value,
    });

    if (error) {
        alert(error.message)
    } else {
        alert("Successfully signup please check your email");
        console.log(data);
    }
})

loginBtn.addEventListener("click", async () => {
    console.log("loginbtn clicked");
    
    const {data, error} = await supabase.auth.signInWithPassword({
        email: emailInput.value,
        password: passwordInput.value,
    });

    if(error) {
        alert(error.message)
    } 

    if(data) {
        showPost()
    }
})


async function loadPost () {
    const {
        data: {session},
    } = await await supabase.auth.getSession();

    if(!session) {
        alert("Please login first")
        return
    }

    showPost()

}




async function showPost() {
    const { data, error } = await supabase
        .from("posting")
        .select("*")

    if (error) {
        console.log("Eroor fetching posts", error);
        return;
    }

    userFeed.innerHTML = "";

    data.forEach((post) => {

        const postCard = document.createElement("div");
        postCard.className = "post-card border border-1 border-gray-300 rounded-md p-3 mt-3";
        postCard.dataset.id = post.id;

        // Profile section

        const profile = document.createElement("div");
        profile.className = "img-name-sect flex items-center gap-3";
        profile.innerHTML = `
        <img src="./images/profile-pic/user.png" alt="" class="w-8 h-8">
      <div class="name"><p>Anonymous</p></div>
        `;

        // content section
        const content = document.createElement("div");
        content.className = "content";
        content.textContent = post.content;

        // button section

        const buttons = document.createElement("div");
        buttons.className = "buttons-card flex items-center justify-end gap-3 ";

        // like button

        const likeButton = document.createElement("i");
        likeButton.className = "fa-regular fa-heart text-[20px]";

        // delete button

        const deleteBtn = document.createElement("i");
        deleteBtn.className = "fa-solid fa-trash text-[20px] cursor-pointer";
        deleteBtn.addEventListener("click", async () => {
            const {error} = await supabase.from("posting").delete().eq("id", post.id);

            if(error) {
                alert("Error in deleting post", error)
            } else {
                postCard.remove();
            }
        });

        buttons.appendChild(likeButton);
        buttons.appendChild(deleteBtn);

        postCard.appendChild(profile);
        postCard.appendChild(content);
        postCard.appendChild(buttons);

        userFeed.appendChild(postCard);

    })
}



postBtn.addEventListener("click", async () => {
    let content = userInput.value.trim();
    if (!content) return;

    const { error } = await supabase
        .from("posting")
        .insert({ content });

    if (error) {
        console.log("Error inserting post", error);
    } else {
        userInput.innerHTML = "";
        alert("Your post is added")
        showPost()
    }
});


showPost()



