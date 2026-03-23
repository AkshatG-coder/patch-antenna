#include <bits/stdc++.h>
using namespace std;

int main()
{
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int N;
    cin >> N;
    vector<long long> A(N);
    for (int i = 0; i < N; i++)
    {
        cin >> A[i];
    }
    int Q;
    cin >> Q;
    while (Q--)
    {
        int L, R;
        cin >> L >> R;
        long long k;
        L--;
        R--;
        cin >> k;
        long long ans = 0;
        for (int i = L; i <= R; i++)
        {
            if (A[i] > k)
            {

                ans += k;
                A[i] -= k;
            }
            else
            {

                ans += A[i];
                A[i] = 0;
            }
        }
        cout << ans << endl;
    }
}
