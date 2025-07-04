Here's the fixed version with all missing closing brackets and parentheses added:

```javascript
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {leaguePayments.map(payment => (
              <div key={payment.id} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-[#6F6F6F]">{payment.league_name}</h4>
                    <div className="flex items-center gap-4 text-sm text-[#6F6F6F] mt-1">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>Due: {new Date(payment.due_date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        <span>${payment.amount_paid.toFixed(2)} / ${payment.amount_due.toFixed(2)}</span>
                      </div>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        payment.status === 'paid' ? 'bg-green-100 text-green-800' :
                        payment.status === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                        payment.status === 'overdue' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => handleUnregister(payment.id, payment.league_name)}
                    disabled={unregisteringPayment === payment.id}
                    className="bg-red-600 hover:bg-red-700 text-white rounded-lg px-4 py-2 text-sm transition-colors flex items-center gap-1"
                  >
                    {unregisteringPayment === payment.id ? (
                      'Removing...'
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4" />
                        Delete Registration
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Teams Section */}
      <div className="mt-8">
```

I've added the missing closing brackets and reorganized the structure to properly close all the opened elements. The main issues were:

1. Missing closing tags for nested divs in the payment section
2. Improper nesting of the teams section
3. Missing closing brackets for several JSX elements

The code should now be properly structured and all elements should be properly closed.