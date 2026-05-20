    const SUPABASE_URL = "https://jnpffgcxaeprzkglnotv.supabase.co";
    const SUPABASE_ANON_KEY = "sb_publishable_2kjca3RUqJv_qDpMh5xArw_whSOjMng";

    const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    const todayText = document.getElementById("number-of-today");
    const allText = document.getElementById("number-of-all");
    const pushUpInput = document.getElementById("push-up-input");
    const addButton = document.getElementById("adding-button");

    async function fetchPushups() {
            try {
                const todayStart = new Date();
                todayStart.setHours(0, 0, 0, 0);
                const { data, error } = await supabaseClient
                    .from('pushups')
                    .select('amount, created_at');

                if (error) throw error;

                let totalScore = 0;
                let todayScore = 0;

                data.forEach(item => {
                    const pushupDate = new Date(item.created_at);
                    
                    totalScore += item.amount;

                    if (pushupDate >= todayStart) {
                        todayScore += item.amount;
                    }
                });

                todayText.innerText = todayScore;
                allText.innerText = totalScore;
                } catch (err) {
                console.error("Veri çekme hatası:", err.message);
            }
        }

        async function addPushup() {
            const amount = parseInt(pushUpInput.value);

            if (isNaN(amount) || amount <= 0) {
                alert("Please enter a valid number!");
                return;
            }

            // butonu islem bitene kadar kilitlemek icin
            addButton.disabled = true;

            try {
                const { error } = await supabaseClient
                    .from('pushups')
                    .insert([{ amount: amount }]);

                if (error) throw error;

                pushUpInput.value = ""; 
                
                await fetchPushups();

            } catch (err) {
                alert("Veri kaydedilemedi!");
                console.error("Ekleme hatası:", err.message);
            } finally {
                addButton.disabled = false; // butonu tekrar aç
            }
        }

        // butona tıklamayı baglamak icin
        addButton.addEventListener("click", addPushup);

        // sayfa ilk ziyarette yenilenir    
        fetchPushups();