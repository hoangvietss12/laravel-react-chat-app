<x-mail::message>
    Xin chào, {{$user->name}}

    @if($user->blocked_at)
        Tài khoản của bạn đã bị khóa. Bạn không còn đăng nhập được vào hệ thống nữa.
    @else
        Tài khoản của bạn đã được active. Bạn có thể đăng nhập được vào hệ thống.

    <x-mail::button url="{{route('login')}}">
        Nhấn vào đây để đăng nhập
    </x-mail::button>
    @endif
    
    Cảm ơn, <br>
    {{config('app.name')}}
</x-mail::message>
